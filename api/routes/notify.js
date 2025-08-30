// routes/notify.js
import express from 'express';
import { sendingEmail } from '../utils/sendingEmail.js';

const router = express.Router();

router.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;
  try {
    await sendingEmail(to, subject, text);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send email' });
  }
});

export default router;
