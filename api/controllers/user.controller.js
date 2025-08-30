import User from "../models/user.model.js";
import createError from "../utils/createError.js";


export const deleteUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (req.userId !== user._id.toString()) {
    return next(createError(403, "You can delete only your account!"));
  }
  await User.findByIdAndDelete(req.params.id);
  res.status(200).send("deleted.");
};


export const getUser = async (req, res, next) => {
    const user = await User.findById(req.params.id);
    res.status(200).send(user);
}

// controllers/user.controller.js
export const getUserListButMe = async (req, res) => {
  try {
    // const users = await User.find({ _id: { $ne: req.user._id } })
    const users = await User.find({ _id: { $ne: req.userId } })  
      .select("username role email isActive");

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};


// @desc    Get all users
// @route   GET /api/users
// @access  Private (only authenticated users)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "username email"); // only return name & email
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error while fetching users" });
  }
};



