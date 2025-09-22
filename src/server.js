import express from "express";
import config from "./config/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import routes from './routes/index.js';
import connectDB from "./db/mongoose.js";
import { errorHandler } from "./common/middlewares/error.middleware.js";
import { requestLogger } from "./middleware-global/requestLogger.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);
app.use(helmet());

app.use(requestLogger);

app.use("/api", routes);

app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`🚀 Server running on http://localhost:${config.port}`);
  });
};

startServer();