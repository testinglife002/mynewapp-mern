//./controllers/reminderController.js
import { sendEmail } from '../utils/emailSender.js';
import Todo from '../models/todo.model.js';
import User from '../models/user.model.js'; // assuming you store user email

export const checkAndSendReminders = async () => {
  const now = new Date();
  const upcoming = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now

  /*
  const todos = await Todo.find({
    dueDate: { $lte: upcoming, $gte: now },
    isTrashed: false,
    reminderSent: { $ne: true },
  }).populate('assignedTo');
  */
   const todos = await Todo.find({
    dueDate: { $lte: upcoming, $gte: now },
    start: { $lte: upcoming, $gte: now },
    notified: false,
  }).populate("userId");

  for (const todo of todos) {
    // const user = todo.assignedTo;
    const user = todo.userId;

    if (user?.email) {
      // console.log(user.email);
      await sendEmail({
        to: user.email,
        subject: `⏰ Reminder: Task "${todo.title}" is due soon!`,
        text: `Hi ${user.username || ''},\n\nYour task "${todo.title}" is due on ${todo.dueDate}.\n\nDon't forget to complete it in time!`,
      });

      // task.reminderSent = true;
      // Mark as notified to avoid duplicate sends
      todo.notified = true;
      await todo.save();
    }
  }
};
