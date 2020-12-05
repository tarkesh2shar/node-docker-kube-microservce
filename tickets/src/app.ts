import express from "express";
import { json } from "body-parser";
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import {
  errorHandler,
  currentUser,
  NotFoundError,
  NotAuthorizedError,
  DatabaseConnectionError,
} from "@tticker/common";
import cookieSession from "cookie-session";
import "express-async-errors";
import { indexTicketRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";
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
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);
app.all("*", async (req, res, next) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
