import express from "express";
import { json } from "body-parser";
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { errorHandler, currentUser, NotFoundError } from "@tticker/common";
import cookieSession from "cookie-session";
import "express-async-errors";
import { indexOrderRouter } from "./routes";
import { deleteOrderRouter } from "./routes/delete";
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
app.use(showOrderRouter);
app.use(deleteOrderRouter);
app.use(newOrderRouter);
app.use(indexOrderRouter);
app.all("*", async (req, res, next) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
