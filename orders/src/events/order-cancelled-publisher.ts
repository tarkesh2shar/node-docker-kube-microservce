import { OrderCancelledEvent, Publisher, Subjects } from "@tticker/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
