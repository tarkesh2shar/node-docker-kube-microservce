import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from "@tticker/common";
import { QUENE_GROUP_NAME } from "./quene-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../models/order";
export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  queneGroupName = QUENE_GROUP_NAME;
  readonly subject = Subjects.PaymentCreated;
  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId);
    if (!order) {
      throw new Error("Order not Found");
    }
    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();
    msg.ack();
  }
}
