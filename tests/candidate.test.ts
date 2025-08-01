import supertest, { SuperAgentTest } from "supertest";
import app from "../src/app";
import { existingAdmin, existingCandidate, newCandidate } from "./constants";

describe("Candidate API", () => {
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
   * Candidate Add API Endpoint
   * 201 on successful candidate add
   *
   * 400 on first name not string
   * 400 on first name longer than 100 characters
   * 400 on middle name not string
   * 400 on middle name longer than 100 characters
   * 400 on last name not string
   * 400 on last name longer than 100 characters
   * 400 on description not string
   * 400 on description longer than 1000 characters
   *
   * 400 on candidate already exists
   *
   * 401 on add attempt without login
   * */

  describe("POST /api/candidate/add", () => {
    const apiUrl = "/api/candidate/add";

    test("201 on successful candidate add", async () => {
      const res = await agent.post(apiUrl).send(newCandidate);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("message", "Candidate Added");
    });

    test("400 on username not string", async () => {
      const res = await agent.post(apiUrl).send({
        ...newCandidate,
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
        ...newCandidate,
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

    test("400 on first name not string", async () => {
      const res = await agent.post(apiUrl).send({
        ...newCandidate,
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
        ...newCandidate,
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
        ...newCandidate,
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
        ...newCandidate,
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
        ...newCandidate,
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
        ...newCandidate,
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

    test("400 on description not string", async () => {
      const res = await agent.post(apiUrl).send({
        ...newCandidate,
        description: true,
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error[0]).toEqual(
        expect.objectContaining({
          msg: "Description must be a string",
          path: "description",
          location: "body",
        }),
      );
    });

    test("400 on description longer than 1000 characters", async () => {
      const res = await agent.post(apiUrl).send({
        ...newCandidate,
        description: "a".repeat(1001),
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error[0]).toEqual(
        expect.objectContaining({
          msg: "Description must be within 1000 characters",
          path: "description",
          location: "body",
        }),
      );
    });

    test("400 on candidate already exists", async () => {
      const res = await agent.post(apiUrl).send(existingCandidate);

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "Candidate already exists");
    });

    test("401 on attempt without login", async () => {
      const res = await supertest(app).post(apiUrl).send(newCandidate);

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("error", "Unauthorized");
    });
  });
});
