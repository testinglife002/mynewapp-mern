// routes/sendReminder.js
import { sendEmail } from "../utils/sendEmail.js";

export const sendReminderEmail = async (req, res, next) => {
  try {
    const { userEmail, todoTitle, startTime } = req.body;

    await sendEmail({
      to: userEmail,
      subject: `⏰ Reminder: Upcoming Todo "${todoTitle}"`,
      text: `This is a reminder that your todo "${todoTitle}" starts at ${startTime}.`,
      html: `<p>This is a reminder for your todo: <strong>${todoTitle}</strong>.</p>
             <p>It starts at: <strong>${startTime}</strong>.</p>`,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};
