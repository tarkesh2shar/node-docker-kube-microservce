import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from "@tticker/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queneGroupName } from "./quene-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queneGroupName = queneGroupName;
  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    if (!order) {
      throw new Error("Order Not Found");
    }
    order.set({ status: OrderStatus.Cancelled });
    await order.save();
    msg.ack();
  }
}
