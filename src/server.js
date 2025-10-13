import express from "express";
import config from "./config/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes/index.js";
import connectDB from "./db/mongoose.js";
import { errorHandler } from "./common/middlewares/error.middleware.js";
import { requestLogger } from "./middleware-global/requestLogger.js";
import http from "http";
import { Server } from "socket.io";
import path from "path";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: config.cors.origin,
    credentials: true,
  },
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(requestLogger);

app.use(
  "/api/uploads",
  express.static(path.join(process.cwd(), "uploads"), {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", config.cors.origin);
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

app.use("/api", routes);

app.use(errorHandler);

io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);

  socket.on("joinUserRoom", (userId) => {
    socket.join(userId); // each user has their own room
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
});

export { io };

const startServer = async () => {
  await connectDB();
  server.listen(config.port, () => {
    console.log(`🚀 Server running on http://localhost:${config.port}`);
  });
};

startServer();
