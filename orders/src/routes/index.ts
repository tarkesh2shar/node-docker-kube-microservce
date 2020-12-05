import { requireAuth } from "@tticker/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";
const router = express.Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate("Ticket");
  console.log("orders from server", orders);

  res.send(orders);
});
export { router as indexOrderRouter };
