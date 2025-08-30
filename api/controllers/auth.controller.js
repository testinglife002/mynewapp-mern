import User from "../models/user.model.js";
 import createError from "../utils/createError.js";
 import bcrypt from "bcrypt";
 import jwt from "jsonwebtoken";


export const register = async (req, res, next) => {
    console.log(req.body);
    const { username, email, password, img, isSeller, isAdmin } = req.body;
    try {
        if (!email || !password || !username) {
			throw new Error("All fields are required");
		}
        // const userAlreadyExists = await User.findOne({ email }).select('+password');
		const userAlreadyExists = await User.findOne({ email });
        console.log("userAlreadyExists", userAlreadyExists);
		// console.log(image);
		if (userAlreadyExists) {
			return res.status(400).json({ success: false, message: "User already exists" });
		}
        const hash = bcrypt.hashSync(req.body.password, 5);
        const newUser = new User({
            ...req.body,
            password: hash,
            isSeller: isSeller || false,
            isAdmin: isAdmin || false,
            role: isAdmin ? "admin" : "user",
        });

        await newUser.save();
        res.status(201).send("User has been created.");
    } catch (error) {
        // res.status(500).send("Something went wrong.");
        next(error);
    }
}


// export const login = async (req, res, next) => {

// Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return next(createError(400, "Email and password required"));

    const user = await User.findOne({ email }).select("+password");
    if (!user) return next(createError(404, "User not found"));

    const isCorrect = bcrypt.compareSync(password, user.password);
    if (!isCorrect)
      return next(createError(400, "Wrong email or password"));

    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
        isSeller: user.isSeller,
        role: user.role,
      },
      process.env.JWT_KEY,
      { expiresIn: "7d" }
    );

    const { password: pwd, ...info } = user._doc;

    res.cookie("accessToken", token, {
            httpOnly: true,
            secure: false, 
            sameSite: "Lax",   // not "None" in local dev
        })
        .status(200)
        .json(info);
  } catch (err) {
    next(err);
  }
};


// Logout
export const logout = (req, res) => {
  res
    .clearCookie("accessToken", { httpOnly: true, secure: false, sameSite: "Lax" })
    .status(200)
    .json({ message: "User logged out" });
};
  

 