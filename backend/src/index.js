import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";

import authRouter from "./routes/auth.route.js";
import noteRouter from "./routes/note.route.js";
import columnRouter from "./routes/column.route.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true, 
}));

app.use("/api/auth", authRouter);
app.use("/api/notes", noteRouter);
app.use("/api/columns", columnRouter);
app.get('/api/test', (req, res) => res.json({ ok: true }));

app.listen(5001, () => {
  console.log("Server is running on PORT:" + PORT);
  connectDB();
});
