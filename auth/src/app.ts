import express from "express";
import { json } from "body-parser";
import { currentUserRouter } from "./routes/current-user";
import { signoutRouter } from "./routes/signout";
import { signInRouter } from "./routes/signin";
import { singupRouter } from "./routes/signup";
import { errorHandler } from "@tticker/common";
import { NotFoundError } from "@tticker/common";
import cookieSession from "cookie-session";
import "express-async-errors";
const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUserRouter);
app.use(signoutRouter);
app.use(singupRouter);
app.use(signInRouter);
app.all("*", async (req, res, next) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
