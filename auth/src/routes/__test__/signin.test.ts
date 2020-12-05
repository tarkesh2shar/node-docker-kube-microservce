import request from "supertest";
import { app } from "../../app";

it("fails when a email does not exists is supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "1234567890" })
    .expect(400);
});
it("fails when an incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "1234567890" })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "09232322" })
    .expect(400);
});

it("responds with cookie when given valid credentials ", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "1234567890" })
    .expect(201);

  let res = await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "1234567890" })
    .expect(201);

  expect(res.get("Set-Cookie")).toBeDefined();
});
