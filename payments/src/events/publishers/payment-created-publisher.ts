import { PaymentCreatedEvent, Publisher, Subjects } from "@tticker/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
