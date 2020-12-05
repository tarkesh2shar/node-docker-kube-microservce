import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../../models/order";
import { Message } from "node-nats-streaming";
import { ExpirationCompleteEvent } from "@tticker/common";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    price: 20,
    title: "concert",
  });
  await ticket.save();
  const order = Order.build({
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
    userId: "Asd",
  });
  await order.save();

  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { msg, data, order, ticket, listener };
};

it("updates the order status to cancelled", async () => {
  const { msg, data, order, ticket, listener } = await setup();
  await listener.onMessage(data, msg);
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits an OrderCancelled Event", async () => {
  const { msg, data, order, ticket, listener } = await setup();
  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(order.id);
});

it("acks the message", async () => {
  const { msg, data, order, ticket, listener } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
