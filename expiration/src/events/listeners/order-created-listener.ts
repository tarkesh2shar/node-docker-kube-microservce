import { Listener, OrderCreatedEvent, Subjects } from "@tticker/common";
import { queneGroupName } from "./quene-group-name";
import { Message } from "node-nats-streaming";
import { expirationQuene } from "../../queues/expiration-quene";
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queneGroupName = queneGroupName;
  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(
      `Waiting for this many seconds to process a JOB :::: ${delay},`
    );

    await expirationQuene.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );
    msg.ack();
  }
}
