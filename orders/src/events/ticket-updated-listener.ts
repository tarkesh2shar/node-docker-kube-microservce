import {
  Listener,
  Subjects,
  TicketCreatedEvent,
  TicketUpdatedEvent,
} from "@tticker/common";
import { QUENE_GROUP_NAME } from "./quene-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../models/ticket";
export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queneGroupName = QUENE_GROUP_NAME;
  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findByEvent({
      ...data,
    });
    if (!ticket) {
      throw new Error("Ticket not Found");
    }
    const { price, title } = data;
    ticket.set({ title, price });
    await ticket.save();
    msg.ack();
  }
}
