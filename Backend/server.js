import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./src/modules/user/routes/userRoutes.js";
import adminRouter from "./src/modules/admin/routes/adminRoutes.js";
import http from "http";
import socketHandler from "./socket.js";
import notificationRouter from "./src/modules/user/routes/NotificationRoutes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.FRONTEND_URL }));
dotenv.config();

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connection success");
  } catch (err) {
    console.log("NOT connect");
    console.log(err);
  }
}
main();

const server = http.createServer(app);

app.use("/api", userRouter);
app.use("/api", adminRouter);
app.use("/api", notificationRouter);

app.get("/", (req, res) => {
  res.send("Server is working");
});

socketHandler(server);

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on PORT:${PORT}`);
});
