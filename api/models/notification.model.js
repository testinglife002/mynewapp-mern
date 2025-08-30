// models/notification.model.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // receiver
    type: { type: String, enum: ["todo", "task", "board"], required: true },
    action: { type: String, required: true }, // created, updated, deleted, assigned, reminder, email, etc.
    entityId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Todo/Task/Board id
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;