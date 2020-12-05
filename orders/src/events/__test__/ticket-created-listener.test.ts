import { TicketCreatedEvent } from "@tticker/common";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";

const setup = async () => {
  //create an instacse of the listner//
  const listner = new TicketCreatedListener(natsWrapper.client);
  //create fake data event//
  const data: TicketCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
  };
  //create a fake message object//
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listner, data, msg };
};
it("creates and saves a ticket", async () => {
  const { listner, data, msg } = await setup();
  //call the onMessage function with the data object +message object
  await listner.onMessage(data, msg);
  //write assersition to make sure a ticket was created
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("acks the messsage", async () => {
  const { listner, data, msg } = await setup();
  //call the onMessage function with the data object +message object
  await listner.onMessage(data, msg);
  //write assersions to make sure ack was called !
  expect(msg.ack).toHaveBeenCalled();
});
