// backend/cron.js
import dotenv from "dotenv";
dotenv.config(); // ✅ Load .env FIRST
import cron from 'node-cron';
import { checkAndSendReminders } from './controllers/reminderController.js';
// import Task from "./models/todo.model.js"; // Adjust path as needed
import Todo from './models/todo.model.js';
import { sendEmail } from './utils/sendEmail.js';
import dayjs from 'dayjs';
import { sendingEmail } from "./utils/sendingEmail.js";
// import mongoose from "mongoose";
// import connectDB from './config/db.js';

// Connect to MongoDB
/*
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
*/

// import cron from "node-cron";
// import Todo from "./models/Todo.js";
// import sendEmail from "./utils/sendEmail.js";
// import dayjs from "dayjs";
// import cron from "node-cron";
// import dayjs from "dayjs";
// import Todo from "./models/todo.model.js";
// import { sendingEmail } from "./utils/sendingEmail.js";

// import cron from "node-cron";
// import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js";
// import Todo from "./models/todo.model.js";
// import { sendingEmail } from "./utils/sendingEmail.js";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

// Track when cron last ran
let lastRun = dayjs();

cron.schedule("* * * * *", async () => {
  try {
    const now = dayjs();
    const prevRun = lastRun;
    lastRun = now; // update for next iteration

    const todos = await Todo.find({}).populate("userId").populate("projectId");

    for (const todo of todos) {
      const startTime = dayjs(todo.start);

      // Ensure remindersSent is always an array
      if (!Array.isArray(todo.remindersSent)) {
        todo.remindersSent = [];
      }

      // 1️⃣ Created Notification
      if (!todo.remindersSent.includes("created")) {
        await sendingEmail(
          todo.userId.email,
          `Todo Created: ${todo.title}`,
          `Your task "${todo.title}" has been created.`
        );
        todo.remindersSent.push("created");
      }

      // 2️⃣ One Day Before Start
      const oneDayBefore = startTime.subtract(1, "day");
      if (
        !todo.remindersSent.includes("1day") &&
        oneDayBefore.isAfter(prevRun) &&
        oneDayBefore.isSameOrBefore(now)
      ) {
        await sendingEmail(
          todo.userId.email,
          `Reminder: ${todo.title}`,
          `Your task "${todo.title}" starts tomorrow.`
        );
        todo.remindersSent.push("1day");
      }

      // 3️⃣ One Hour Before Start
      const oneHourBefore = startTime.subtract(1, "hour");
      if (
        !todo.remindersSent.includes("1hour") &&
        oneHourBefore.isAfter(prevRun) &&
        oneHourBefore.isSameOrBefore(now)
      ) {
        await sendingEmail(
          todo.userId.email,
          `Reminder: ${todo.title}`,
          `Your task "${todo.title}" starts in 1 hour.`
        );
        todo.remindersSent.push("1hour");
      }

      // 4️⃣ Handle Recurring Todos
      if (todo.recurrence && todo.dueDate && now.isAfter(dayjs(todo.dueDate))) {
        const currentDue = dayjs(todo.dueDate).isValid()
          ? dayjs(todo.dueDate)
          : startTime; // fallback if dueDate missing

        let newStart, newDue;
        if (todo.recurrence === "daily") {
          newStart = startTime.add(1, "day");
          newDue = currentDue.add(1, "day");
        } else if (todo.recurrence === "weekly") {
          newStart = startTime.add(1, "week");
          newDue = currentDue.add(1, "week");
        } else if (todo.recurrence === "monthly") {
          newStart = startTime.add(1, "month");
          newDue = currentDue.add(1, "month");
        }

        if (newStart && newDue) {
          await Todo.create({
            title: todo.title,
            description: todo.description,
            start: newStart.toDate(),
            dueDate: newDue.toDate(),
            recurrence: todo.recurrence,
            remindersSent: ["created"], // created reminder sent immediately
            userId: todo.userId._id,
            projectId: todo.projectId._id
          });

          await sendingEmail(
            todo.userId.email,
            `Recurring Todo Created: ${todo.title}`,
            `Your recurring task "${todo.title}" has been scheduled again.`
          );

          // Update current todo's dueDate for next cycle
          todo.dueDate = newDue.toDate();
        }
      }

      // ✅ Save changes to prevent re-sending
      await todo.save();
    }
  } catch (err) {
    console.error("Cron job error:", err);
  }
});



// mongoose.set('strictQuery', true);
// connectDB(); // ✅ Now safe to use env vars

// Cron job runs every minute
/*
cron.schedule("* * * * *", async () => {
  console.log("🔄 Checking recurring tasks...");

  try {
    const now = new Date();

    // Fetch tasks with recurrence
    const recurringTodos = await Todo.find({
      recurrence: { $exists: true, $ne: null },
      recurringProcessed: false, // only unprocessed
    });

    for (let todo of recurringTodos) {
      const { recurrence, dueDate, title, userId, projectId } = todo;

      // Check if dueDate has passed
      if (new Date(todo.dueDate) <= now) {
        let newDueDate = new Date(todo.dueDate);
        // Clone the task for the next recurrence
        // let newDueDate = new Date(dueDate);

        if (todo.recurrence === "daily") newDueDate.setDate(newDueDate.getDate() + 1);
        else if (todo.recurrence === "weekly") newDueDate.setDate(newDueDate.getDate() + 7);
        else if (todo.recurrence === "monthly") newDueDate.setMonth(newDueDate.getMonth() + 1);

        await Todo.create({
          title: todo.title,
          userId: todo.userId,
          projectId: todo.projectId,
          recurrence: todo.recurrence,
          dueDate: newDueDate,
        });

        // Mark current one as processed
        todo.recurringProcessed = true;
        await todo.save();

        console.log(`✅ Created next recurring task for ${todo.title}`);
      }
    }
  } catch (err) {
    console.error("❌ Error processing recurring tasks:", err.message);
  }
});
*/


// Run every 15 minutes
/*
cron.schedule('* /15 * * * *', () => {
  console.log('🔁 Running reminder check...');
  checkAndSendReminders();
});
*/

/*
cron.schedule('* / 5 * * * *', async () => {
  const now = new Date();
  const inAnHour = dayjs().add(1, "hour").toDate();
  const todos = await Todo.find({
    start: { $gte: now, $lte: inAnHour },
  }).populate("userId");

  for (let todo of todos) {
    // console.log(todo.userId.email);
    await sendEmail({
      to: todo.userId.email,
      subject: `⏰ Upcoming Todo: ${todo.title}`,
      text: `Reminder: "${todo.title}" is starting in less than an hour.`,
    });
  }
});
*/


/*
cron.schedule('* * * * *', async () => {
  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

  const upcomingTodos = await Todo.find({
    start: { $gte: now, $lte: oneHourLater },
    notified: false,
  }).populate("userId");

  for (const todo of upcomingTodos) {
    // console.log(todo.userId.email);
    await sendingEmail(todo.userId.email, `Upcoming Todo: ${todo.title}`, '...');

    // Mark as notified
    // todo.notified = true;
    await todo.save();
  }
});
*/

