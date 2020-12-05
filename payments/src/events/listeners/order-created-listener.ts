import { Listener, OrderCreatedEvent, Subjects } from "@tticker/common";
import { queneGroupName } from "./quene-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queneGroupName = queneGroupName;
  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });
    await order.save();
    msg.ack();
  }
}
