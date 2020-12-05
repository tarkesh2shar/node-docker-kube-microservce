import {
  ExpirationCompleteEvent,
  Listener,
  OrderStatus,
  Subjects,
} from "@tticker/common";
import { Message } from "node-nats-streaming";
import { Order } from "../models/order";
import { OrderCancelledPublisher } from "./order-cancelled-publisher";
import { QUENE_GROUP_NAME } from "./quene-group-name";
export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queneGroupName = QUENE_GROUP_NAME;
  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("Ticket");
    if (!order) {
      throw new Error("Order Not found");
    }
    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }
    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
      version: order.version,
    });
    msg.ack();
  }
}
