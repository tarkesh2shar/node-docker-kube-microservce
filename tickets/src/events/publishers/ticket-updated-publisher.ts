import { Publisher, Subjects, TicketUpdatedEvent } from "@tticker/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
