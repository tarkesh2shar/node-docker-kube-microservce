import express from "express";
import { json } from "body-parser";
import {
  errorHandler,
  currentUser,
  NotFoundError,
  NotAuthorizedError,
  DatabaseConnectionError,
} from "@tticker/common";
import cookieSession from "cookie-session";
import "express-async-errors";
import { createChargeRouter } from "./routes/new";
const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);
app.use(createChargeRouter);
app.all("*", async (req, res, next) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
