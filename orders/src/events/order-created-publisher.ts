import { OrderCreatedEvent, Publisher, Subjects } from "@tticker/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
