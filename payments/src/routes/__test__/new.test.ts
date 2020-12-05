import { OrderStatus } from "@tticker/common";
import { Types } from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Payment } from "../../models/payments";
jest.mock("../../stripe");
import { stripe } from "../../stripe";

it("returns a 404 when purchasing an order that does not exists", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signup())
    .send({
      token: "ads",
      orderId: Types.ObjectId().toHexString(),
    })
    .expect(404);
});
it("returns a 401 when purchasing an order that does not belong to a user", async () => {
  const order = Order.build({
    id: Types.ObjectId().toHexString(),
    userId: Types.ObjectId().toHexString(),
    price: 23,
    status: OrderStatus.Complete,
    version: 0,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signup())
    .send({
      token: "ads",
      orderId: order.id,
    })
    .expect(401);
});
it("returns a 400 when purchasing an order that is cancelled", async () => {
  const userId = Types.ObjectId().toHexString();
  const order = Order.build({
    id: Types.ObjectId().toHexString(),
    userId,
    price: 23,
    status: OrderStatus.Cancelled,
    version: 0,
  });
  await order.save();
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signup(userId))
    .expect(400);
});

it("returns a 204 with valid inputs,", async () => {
  const userId = Types.ObjectId().toHexString();
  const order = Order.build({
    id: Types.ObjectId().toHexString(),
    userId,
    price: 23,
    status: OrderStatus.Created,
    version: 0,
  });
  await order.save();
  // await request(app)
  //   .post("/api/payments")
  //   .set("Cookie", global.signup(userId))
  //   .send({
  //     token: "tok_visa",
  //     orderId: order.id,
  //   })
  //   .expect(201);
  // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  // expect(chargeOptions.source).toEqual("tok_visa");
  // expect(chargeOptions.amount).toEqual(23 * 100);
  // expect(chargeOptions.currency).toEqual("usd");
  // const payment = await Payment.findOne({
  //   orderId: order.id,
  //   striptId: chargeOptions.id,
  // });
  // expect(payment).not.toBeNull();
});
