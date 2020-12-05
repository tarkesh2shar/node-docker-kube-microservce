import mongoose from "mongoose";
import { app } from "./app";
import { ExpirationCompleteListener } from "./events/expiration-complete-listener";
import { PaymentCreatedListener } from "./events/payment-created-listener";
import { TicketCreatedListener } from "./events/ticket-created-listener";
import { TicketUpdatedListener } from "./events/ticket-updated-listener";
import { natsWrapper } from "./nats-wrapper";
const start = async () => {
  console.log("Starting...");

  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined ");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined ");
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined ");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined ");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined ");
  }
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    natsWrapper.client.on("close", () => {
      console.log("Nats Connection Closed!");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client?.close());
    process.on("SIGTERM", () => natsWrapper.client?.close());
    console.log("connected to MongoDB");

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();
  } catch (e) {
    console.log(e);
  }
  app.listen(3000, () => {
    console.log("listening on port 3000 !!");
  });
};

start();
