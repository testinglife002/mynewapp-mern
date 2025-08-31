import dotenv from "dotenv";
dotenv.config(); // ✅ Load .env FIRST

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import path from "path";
import { fileURLToPath } from "url"; // ✅
import { dirname } from "path"; // ✅

import connectDB from './config/db.js';


import authRoute from './routes/auth.route.js';
import userRoute from './routes/user.route.js';
import categoryRoute from './routes/category.route.js';
import taskRoute from './routes/task.route.js';
import optionRoute from "./routes/option.route.js";
import projectRoute from "./routes/project.route.js";
import todoRoute from "./routes/todo.route.js";
import boardRoute from "./routes/board.route.js";
import listRoute from "./routes/list.route.js";
import cardRoute from './routes/card.route.js';
import labelRoute from './routes/label.route.js';
import notifyRoutes from './routes/notify.js';
import notificationRoutes from './routes/notification.route.js';
import noteRoutes from './routes/note.route.js';
import postRoutes from './routes/post.route.js';
import designRoutes from './routes/design.route.js';
import projectDesignRoutes from './routes/projectDesign.route.js';
import designsRoutes from './routes/designs.route.js';
import templateRoutes from './routes/template.route.js';
import canvaCommentRoutes from './routes/canvaComment.route.js';
import uploadRoutes from './routes/uploads.route.js';






// ✅ Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// mongoose.set('strictQuery', true);
connectDB(); // ✅ Now safe to use env vars

// server.js
 import "./cron.js"; // Make sure this is after DB connection


const app = express();



app.use(express.json());

app.use(cookieParser());

/*
 app.use(cors({ 
   origin: "http://localhost:3000",
  // origin: "http://localhost:3000", 
  credentials: true 
 }));
*/

app.use(cors({
  origin: "https://mynewapp-mern.vercel.app",
  credentials: true,
}));


/*
const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').map(o => o.trim());

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow mobile apps, curl, Postman
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS not allowed for: " + origin));
  },
  credentials: true,
}));
*/




// ✅ Serve static files (e.g., image uploads)
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));


// Routes
app.use("/api/auth", authRoute);
app.use('/api/users', userRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/tasks', taskRoute);
app.use("/api/options", optionRoute);
app.use("/api/projects", projectRoute);
app.use("/api/todos", todoRoute);
app.use("/api/boards", boardRoute);
app.use("/api/lists", listRoute);
app.use('/api/cards', cardRoute);
app.use('/api/labels', labelRoute);
app.use('/api/notify', notifyRoutes);
app.use('/api/notifications', notificationRoutes  );
app.use('/api/notes', noteRoutes  );
app.use('/api/posts', postRoutes  );
app.use('/api/designs', designRoutes  );
app.use('/api/projectDesigns', projectDesignRoutes  );
app.use('/api/designss', designsRoutes  );
app.use('/api/templates', templateRoutes  );
app.use('/api/canvaComments', canvaCommentRoutes  );
app.use('/api/uploads', uploadRoutes);


// ✅ Default API status check
app.get('/', (req, res) => {
  res.send('MERN Backend is Live! API is running...');
});


app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.stack); // ADD this
  console.error("Unhandled error:", err);
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  res.status(errorStatus).json({ success: false, message: errorMessage });
});


const PORT = process.env.PORT || 8800;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
