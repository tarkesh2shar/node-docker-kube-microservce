import nats from "node-nats-streaming";
console.clear();
import { TicketEventPublisher } from "./events/ticket-created-publisher";
const client = nats
  .connect("ticketing", "abc", {
    url: "http://localhost:4222",
  })
  .on("connect", async () => {
    console.log("Publisher connected to Nats");
    const publisher = new TicketEventPublisher(client);
    try {
      await publisher.publish({
        id: "123",
        title: "concert",
        price: 20,
      });
    } catch (error) {
      console.error(error);
    }
  });
