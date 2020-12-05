import { Listener, Subjects, TicketCreatedEvent } from "@tticker/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../models/ticket";
import { QUENE_GROUP_NAME } from "./quene-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queneGroupName = QUENE_GROUP_NAME;
  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { title, price, id } = data;
    const ticket = Ticket.build({ title, price, id });
    await ticket.save();
    msg.ack();
  }
}
