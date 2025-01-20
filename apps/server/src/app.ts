import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";

const app: Express = express();

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Credentials",
    ],
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));

if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads", { recursive: true });
  console.log("Uploads directory created");
}

// import routes
import userRouter from "./routes/user.routes";
import messageRouter from "./routes/message.routes";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/messages", messageRouter);

export { app };
