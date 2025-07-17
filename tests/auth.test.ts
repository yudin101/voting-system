import supertest, { SuperAgentTest } from "supertest";
import app from "../src/app";
import { newAdmin, existingAdmin } from "./constants";

describe("Auth API", () => {
  let agent: SuperAgentTest & ReturnType<typeof supertest.agent>;

  const loginExistingAdmin = async (): Promise<void> => {
    agent = supertest.agent(app) as SuperAgentTest &
      ReturnType<typeof supertest.agent>;

    await agent
      .post("/api/admin/login")
      .send({
        username: existingAdmin.username,
        password: existingAdmin.password,
      })
      .expect(200);
  };

  /*
   * Register API Endpoint
   * 201 on success
   *
   * 400 on username not a string
   * 400 on username greater than 50 characters
   * 400 on email not a string
   * 400 on email greater than 100 characters
   * 400 on invalid email format
   * 400 on password not a string
   *
   * 400 on email already registered
   * 400 on username already registered
   *
   * 401 on register without admin login
   */

  describe("POST /api/admin/register", () => {
    beforeAll(loginExistingAdmin);

    test("201 on successful registration", async () => {
      const res = await agent.post("/api/admin/register").send(newAdmin);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("message", "Admin added");
    });

    test("400 on username not a string", async () => {
      const res = await agent.post("/api/admin/register").send({
        ...newAdmin,
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

    test("400 on username greater than 50 characters", async () => {
      const res = await agent.post("/api/admin/register").send({
        ...newAdmin,
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

    test("400 on email not a string", async () => {
      const res = await agent.post("/api/admin/register").send({
        ...newAdmin,
        email: 10,
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

    test("400 on email greater than 100 characters", async () => {
      const res = await agent.post("/api/admin/register").send({
        ...newAdmin,
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
      const res = await agent.post("/api/admin/register").send({
        ...newAdmin,
        email: "nopeNotAnEmail",
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

    test("400 on password not a string", async () => {
      const res = await agent.post("/api/admin/register").send({
        ...newAdmin,
        password: false,
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error[0]).toEqual(
        expect.objectContaining({
          msg: "Password must be a string",
          path: "password",
          location: "body",
        }),
      );
    });

    test("400 on email already registered", async () => {
      const res = await agent.post("/api/admin/register").send({
        username: "sthelse",
        email: existingAdmin.email,
        password: existingAdmin.password,
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "Email already exists");
    });

    test("400 on username already registered", async () => {
      const res = await agent.post("/api/admin/register").send({
        username: existingAdmin.username,
        email: "anything@test.com",
        password: existingAdmin.password,
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "Username already exists");
    });

    test("401 on register without admin login", async () => {
      const res = await supertest(app)
        .post("/api/admin/register")
        .send(newAdmin);
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("error", "Unauthorized");
    });
  });

  /*
   * Login API Endpoint
   * 201 on success
   *
   * 400 on username not a string
   * 400 on password not a string
   *
   * 401 on invalid credentials
   */

  describe("POST /api/admin/login", () => {
    test("200 on successful login", async () => {
      const res = await supertest(app).post("/api/admin/login").send({
        username: existingAdmin.username,
        password: existingAdmin.password,
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message", "Logged in");
    });

    test("400 on username not a string", async () => {
      const res = await supertest(app).post("/api/admin/login").send({
        username: true,
        password: existingAdmin.password,
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

    test("400 on password not a string", async () => {
      const res = await supertest(app).post("/api/admin/login").send({
        username: existingAdmin.username,
        password: true,
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error[0]).toEqual(
        expect.objectContaining({
          msg: "Password must be a string",
          path: "password",
          location: "body",
        }),
      );
    });

    test("401 on invalid credentials", async () => {
      const res = await supertest(app).post("/api/admin/login").send({
        username: existingAdmin.username,
        password: "somethingelse",
      });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("error", "Authentication failed");
    });
  });

  /*
   * Logout API Endpoint
   * 201 on success
   * 401 on logout without admin login
   */

  describe("GET /api/admin/logout", () => {
    test("200 on successful logout", async () => {
      const res = await agent.get("/api/admin/logout");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message", "Logged out");
    });

    test("401 on logout without admin login", async () => {
      const res = await supertest(app).get("/api/admin/logout");
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("error", "Unauthorized");
    });
  });

  /*
   * Delete API Endpoint
   * 204 on successful admin account delete
   * 401 on delete without admin login
   */

  describe("DELETE /api/admin/delete", () => {
    beforeAll(loginExistingAdmin);

    test("204 on successful delete", async () => {
      const res = await agent.delete("/api/admin/delete");

      expect(res.statusCode).toEqual(204);
    });

    test("401 on delete without admin login", async () => {
      const res = await supertest(app).delete("/api/admin/delete");
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("error", "Unauthorized");
    });
  });
});
