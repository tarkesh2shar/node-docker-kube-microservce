import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("returns an error if  the ticket doesnt exist", async () => {
  const ticketId = mongoose.Types.ObjectId();
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({
      ticketId,
    })
    .expect(404);
});
it("returns an error if  the ticket is reserved", async () => {
  const ticket = Ticket.build({
    price: 20,
    title: "TicketOne",
    id: mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: "asdasdasd",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });

  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});
it("reserves a Ticket", async () => {
  const ticket = Ticket.build({
    title: "Ticket 2",
    price: 20,
    id: mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
});

it("please do this route message broker event!", async () => {
  const ticket = Ticket.build({
    title: "Ticket 2",
    price: 20,
    id: mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
