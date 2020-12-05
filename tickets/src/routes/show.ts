import express, { Request, Response } from "express";
const router = express.Router();
import { NotFoundError } from "@tticker/common";
import { Ticket } from "../models/ticket";
import "express-async-errors";
router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    throw new NotFoundError();
  }
  res.send(ticket);
});
export { router as showTicketRouter };
