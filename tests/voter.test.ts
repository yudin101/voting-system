import supertest, { SuperAgentTest } from "supertest";
import app from "../src/app";
import { existingAdmin, existingVoter, newVoter } from "./constants";

describe("Voter API", () => {
  let agent: SuperAgentTest & ReturnType<typeof supertest.agent>;

  beforeAll(async () => {
    agent = supertest.agent(app) as SuperAgentTest &
      ReturnType<typeof supertest.agent>;

    await agent
      .post("/api/admin/login")
      .send({
        username: existingAdmin.username,
        password: existingAdmin.password,
      })
      .expect(200);
  });

  /*
   * Voter Add API Endpoint
   * 201 on successful voter add
   *
   * 400 on first name not string
   * 400 on first name longer than 100 characters
   * 400 on middle name not string
   * 400 on middle name longer than 100 characters
   * 400 on last name not string
   * 400 on last name longer than 100 characters
   * 400 on username not string
   * 400 on username longer than 50 characters
   * 400 on email not string
   * 400 on email longer than 100 character
   *
   * 400 on voter already exists
   *
   * 401 on add attempt without login
   * */

  describe("POST /api/voter/add", () => {
    test("201 on successful voter add", async () => {
      const res = await agent.post("/api/voter/add").send(newVoter);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("message", "Voter added");
    });

    test("400 on first name not string", async () => {
      const res = await agent.post("/api/voter/add").send({
        ...newVoter,
        firstName: true,
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error[0]).toEqual(
        expect.objectContaining({
          msg: "First name must be a string",
          path: "firstName",
          location: "body",
        }),
      );
    });

    test("400 on first name longer than 100 characters", async () => {
      const res = await agent.post("/api/voter/add").send({
        ...newVoter,
        firstName: "a".repeat(101),
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error[0]).toEqual(
        expect.objectContaining({
          msg: "First name must be within 100 characters",
          path: "firstName",
          location: "body",
        }),
      );
    });

    test("400 on middle name not string", async () => {
      const res = await agent.post("/api/voter/add").send({
        ...newVoter,
        middleName: true,
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error[0]).toEqual(
        expect.objectContaining({
          msg: "Middle name must be a string",
          path: "middleName",
          location: "body",
        }),
      );
    });

    test("400 on middle name longer than 100 characters", async () => {
      const res = await agent.post("/api/voter/add").send({
        ...newVoter,
        middleName: "a".repeat(101),
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error[0]).toEqual(
        expect.objectContaining({
          msg: "Middle name must be within 100 characters",
          path: "middleName",
          location: "body",
        }),
      );
    });

    test("400 on last name not string", async () => {
      const res = await agent.post("/api/voter/add").send({
        ...newVoter,
        lastName: true,
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error[0]).toEqual(
        expect.objectContaining({
          msg: "Last name must be a string",
          path: "lastName",
          location: "body",
        }),
      );
    });

    test("400 on last name longer than 100 characters", async () => {
      const res = await agent.post("/api/voter/add").send({
        ...newVoter,
        lastName: "a".repeat(101),
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error[0]).toEqual(
        expect.objectContaining({
          msg: "Last name must be within 100 characters",
          path: "lastName",
          location: "body",
        }),
      );
    });

    test("400 on username not string", async () => {
      const res = await agent.post("/api/voter/add").send({
        ...newVoter,
        username: true,
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error[0]).toEqual(
        expect.objectContaining({
          msg: "Username must be a string",
          path: "username",
          location: "body",
        }),
      );
    });

    test("400 on username longer than 50 characters", async () => {
      const res = await agent.post("/api/voter/add").send({
        ...newVoter,
        username: "a".repeat(51),
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error[0]).toEqual(
        expect.objectContaining({
          msg: "Username must be within 50 characters",
          path: "username",
          location: "body",
        }),
      );
    });

    test("400 on email not string", async () => {
      const res = await agent.post("/api/voter/add").send({
        ...newVoter,
        email: true,
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error[0]).toEqual(
        expect.objectContaining({
          msg: "Email must be a string",
          path: "email",
          location: "body",
        }),
      );
    });

    test("400 on email longer than 100 characters", async () => {
      const res = await agent.post("/api/voter/add").send({
        ...newVoter,
        email: "a".repeat(80) + "@" + "s".repeat(30) + ".com",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error[0]).toEqual(
        expect.objectContaining({
          msg: "Email must be within 100 characters",
          path: "email",
          location: "body",
        }),
      );
    });

    test("400 on invalid email format", async () => {
      const res = await agent.post("/api/voter/add").send({
        ...newVoter,
        email: "NopeNotAnEmail",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error[0]).toEqual(
        expect.objectContaining({
          msg: "Invalid email format",
          path: "email",
          location: "body",
        }),
      );
    });
  });

  test("400 on voter already exists", async () => {
    const res = await agent.post("/api/voter/add").send(existingVoter);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error", "Voter already exists");
  });

  test("401 on add attempt without login", async () => {
    const res = await supertest(app).post("/api/voter/add").send(newVoter);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error", "Unauthorized");
  });
});
