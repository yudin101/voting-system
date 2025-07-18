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
   * 400 on invalid email format
   *
   * 400 on voter already exists
   *
   * 401 on add attempt without login
   * */

  describe("POST /api/voter/add", () => {
    const apiUrl = "/api/voter/add";

    test("201 on successful voter add", async () => {
      const res = await agent.post(apiUrl).send(newVoter);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("message", "Voter added");
    });

    test("400 on first name not string", async () => {
      const res = await agent.post(apiUrl).send({
        ...newVoter,
        first_name: true,
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error[0]).toEqual(
        expect.objectContaining({
          msg: "First name must be a string",
          path: "first_name",
          location: "body",
        }),
      );
    });

    test("400 on first name longer than 100 characters", async () => {
      const res = await agent.post(apiUrl).send({
        ...newVoter,
        first_name: "a".repeat(101),
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error[0]).toEqual(
        expect.objectContaining({
          msg: "First name must be within 100 characters",
          path: "first_name",
          location: "body",
        }),
      );
    });

    test("400 on middle name not string", async () => {
      const res = await agent.post(apiUrl).send({
        ...newVoter,
        middle_name: true,
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error[0]).toEqual(
        expect.objectContaining({
          msg: "Middle name must be a string",
          path: "middle_name",
          location: "body",
        }),
      );
    });

    test("400 on middle name longer than 100 characters", async () => {
      const res = await agent.post(apiUrl).send({
        ...newVoter,
        middle_name: "a".repeat(101),
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error[0]).toEqual(
        expect.objectContaining({
          msg: "Middle name must be within 100 characters",
          path: "middle_name",
          location: "body",
        }),
      );
    });

    test("400 on last name not string", async () => {
      const res = await agent.post(apiUrl).send({
        ...newVoter,
        last_name: true,
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error[0]).toEqual(
        expect.objectContaining({
          msg: "Last name must be a string",
          path: "last_name",
          location: "body",
        }),
      );
    });

    test("400 on last name longer than 100 characters", async () => {
      const res = await agent.post(apiUrl).send({
        ...newVoter,
        last_name: "a".repeat(101),
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error[0]).toEqual(
        expect.objectContaining({
          msg: "Last name must be within 100 characters",
          path: "last_name",
          location: "body",
        }),
      );
    });

    test("400 on username not string", async () => {
      const res = await agent.post(apiUrl).send({
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
      const res = await agent.post(apiUrl).send({
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
      const res = await agent.post(apiUrl).send({
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
      const res = await agent.post(apiUrl).send({
        ...newVoter,
        email: "a".repeat(80) + "@" + "b".repeat(20) + ".com",
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
      const res = await agent.post(apiUrl).send({
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

    test("400 on voter email already exists", async () => {
      const res = await agent.post(apiUrl).send({
        ...newVoter,
        email: existingVoter.email,
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "Voter email already exists");
    });

    test("400 on voter username already exists", async () => {
      const res = await agent.post(apiUrl).send({
        ...newVoter,
        email: "somethingnew@test.com",
        username: existingVoter.username,
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "Voter username already exists");
    });

    test("401 on add attempt without login", async () => {
      const res = await supertest(app).post(apiUrl).send(newVoter);

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("error", "Unauthorized");
    });
  });

  /*
   * Voter Check API Endpoint
   * 200 on voter exists wth ID
   * 200 on voter exists with username
   * 200 on voter exists with email
   *
   * 400 on invalid email format
   *
   * 404 on voter not found with ID
   * 404 on voter not found with username
   * 404 on voter not found with email
   *
   * 400 on missing parameters
   *
   * 401 on check attempt without login
   * */

  describe("GET /api/voter/check", () => {
    const apiUrl = "/api/voter/check";

    test("200 on voter exists with ID", async () => {
      const res = await agent.get(apiUrl + `?id=${existingVoter.id}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("voter");
      expect(res.body.voter).toEqual(expect.objectContaining(existingVoter));
    });

    test("200 on voter exists with username", async () => {
      const res = await agent.get(
        apiUrl + `?username=${existingVoter.username}`,
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("voter");
      expect(res.body.voter).toEqual(expect.objectContaining(existingVoter));
    });

    test("200 on voter exists with email", async () => {
      const res = await agent.get(apiUrl + `?email=${existingVoter.email}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("voter");
      expect(res.body.voter).toEqual(
        expect.objectContaining(existingVoter),
      );
    });

    test("400 on invalid email format", async () => {
      const res = await agent.get(apiUrl + `?email=NopeNotAnEmail`);

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error[0]).toEqual(
        expect.objectContaining({
          msg: "Invalid email format",
          path: "email",
          location: "query",
        }),
      );
    });

    test("400 on missing parameters", async () => {
      const res = await agent.get(apiUrl);

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "Missing query parameters");
    });

    test("401 on check attempt without login", async () => {
      const res = await supertest(app).get(apiUrl + `?id=${existingVoter.id}`);

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("error", "Unauthorized");
    });
  });
});
