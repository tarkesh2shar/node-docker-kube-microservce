import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@tticker/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";
const router = express.Router();
import "express-async-errors";

router.get(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("Ticket");
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    res.send(order);
  }
);
export { router as showOrderRouter };
