import express, { Request, Response } from "express";
const router = express.Router();
import { Ticket } from "../models/ticket";
import "express-async-errors";
router.get("/api/tickets", async (req: Request, res: Response) => {
  const tickets = await Ticket.find({ orderId: undefined });
  res.send(tickets);
});
export { router as indexTicketRouter };
