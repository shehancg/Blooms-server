import {describe, it} from "@jest/globals";
import request from "supertest"
import {app} from "../src/server";

describe("USER LOGIN", () => {
  it("USER LOGIN", async () => {
    await request(app)
      .post("/api/users/login")
      .send({email: "shehan@gmail.com", password: "1234"})
      .set("Accept", "application/json")
      .expect(200);
  });
});

describe("USER REG", () => {
    it("USER REGISTRATION", function (done) {
      request(app)
        .post("/api/users/register")
        .send({email:"anne@gmail.com", name:"anne", password: "1234", phone:"987654", address:"colombo"})
        .set("Accept", "application/json")
        .expect(200)
        .end(function (err, res) {
          if (err) {return done(err);}
          return done();
        });
    });
  });