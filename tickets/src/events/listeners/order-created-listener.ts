import { Listener, OrderCreatedEvent, Subjects } from "@tticker/common";
import { queneGroupName } from "./quene-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queneGroupName = queneGroupName;
  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    //Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    //If no ticket, throw Error
    if (!ticket) {
      throw new Error("Ticket not Found");
    }
    //mark the ticket as being resercerd
    ticket.set({ orderId: data.id });
    //Save the ticket
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId,
    });

    //ack the message
    msg.ack();
  }
}
