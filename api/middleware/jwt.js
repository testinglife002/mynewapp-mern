// middleware/jwt.js
import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next(createError(401, "Not authenticated"));

  const token = authHeader.split(" ")[1]; // "Bearer <token>"
  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (err) return next(createError(403, "Invalid token"));
    req.userId = payload.id;
    req.isAdmin = payload.isAdmin || false;
    req.isSeller = payload.isSeller || false;
    req.role = payload.role || "user";
    next();
  });
};


/*
export const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken; // ✅ cookies only
  if (!token) return next(createError(401, "Not authenticated"));

  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (err) return next(createError(403, "Invalid token"));

    req.userId = payload.id;
    req.isAdmin = payload.isAdmin || false;
    req.isSeller = payload.isSeller || false;
    req.role = payload.role || "user";
    next();
  });
};
*/



