import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("marks an order as cancelled ", async () => {
  //create a ticket with Ticket Model
  const ticket = Ticket.build({
    title: "concert",
    price: 23,
    id: mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const user = global.signup();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("Publish Order Cancelled Events to Nats", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 23,
    id: mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const user = global.signup();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
