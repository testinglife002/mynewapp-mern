// middleware/verifyAdmin.js
import createError from "../utils/createError.js";
import jwt from "jsonwebtoken";




export const verifyAdmin = (req, res, next) => {
  if (!req.isAdmin) return next(createError(403, "Only admins allowed"));
  next();
};


/*
export const verifyAdmin = (req, res, next) => {
  if (!req.userId || !req.isAdmin) {
    return next(createError(403, "Only admins allowed"));
  }
  const token = req.cookies.accessToken;
  if (!token) return next(createError(401, "You are not authenticated!"));

  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (err) return next(createError(403, "Token is not valid!"));

    if (!payload.isAdmin) {
      return next(createError(403, "Only admins are allowed to perform this action"));
    }

    req.userId = payload.id;
    req.isAdmin = payload.isAdmin;
    req.role = payload.role; // optional
    next();
  });
};
*/
