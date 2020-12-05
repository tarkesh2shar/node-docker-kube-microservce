import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";
import jwt from "jsonwebtoken";
jest.mock("../nats-wrapper");
let mongo: any;

declare global {
  namespace NodeJS {
    interface Global {
      signup(id?: string): string[];
    }
  }
}
beforeAll(async () => {
  process.env.JWT_KEY = "ASDFGHJKL";
  mongo = new MongoMemoryServer();
  const mongoURI = await mongo.getUri();
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});
beforeEach(async () => {
  jest.clearAllMocks();
  //@ts-ignore
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signup = (id?: string) => {
  //Build a JWT payload .
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };
  //Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  //Build a session object!!
  const session = { jwt: token };
  //Turns that session into JSON
  const sessionJSON = JSON.stringify(session);
  //tAKE JSON AND ENCODE IT TO BASE64
  const base64 = Buffer.from(sessionJSON).toString("base64");
  //return a string that is a cookie with encoded data
  return [`express:sess=${base64}`];
};
