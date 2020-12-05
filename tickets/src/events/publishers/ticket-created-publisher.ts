import { Publisher, Subjects, TicketCreatedEvent } from "@tticker/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
