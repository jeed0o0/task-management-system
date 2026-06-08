import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import routes from "./routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { metricsMiddleware, metricsHandler } from "./config/prometheus";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: "*", // ✅ مؤقتاً للتجربة,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("short"));
}

app.use(metricsMiddleware);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT",
      message: "Too many requests, please try again later",
    },
  },
});
app.use(limiter);

app.use(routes);

app.get("/metrics", metricsHandler);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
