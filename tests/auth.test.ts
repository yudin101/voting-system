import supertest, { SuperAgentTest } from "supertest";
import app from "../src/app";
import pool from "../src/config/db";
import bcrypt from "bcrypt";

describe("Auth API Test", () => {
  let agent: SuperAgentTest & ReturnType<typeof supertest.agent>;

  const loginExistingUser = async (): Promise<void> => {
    agent = supertest.agent(app) as SuperAgentTest &
      ReturnType<typeof supertest.agent>;

    await agent
      .post("/api/admin/login")
      .send({
        username: existingUser.username,
        password: existingUser.password,
      })
      .expect(200);
    console.log("Test admin logged in");
  };

  const newUser = {
    username: "tester",
    email: "tester@test.com",
    password: "tester123",
  };

  const existingUser = {
    username: "existingTester",
    email: "existing@test.com",
    password: "existing123",
  };

  beforeAll(async () => {
    await pool.query(
      `INSERT INTO admin (username, email, password)
      VALUES ($1, $2, $3)`,
      [
        existingUser.username,
        existingUser.email,
        await bcrypt.hash(existingUser.password, 10),
      ],
    );
    console.log("Test admin created");
  });

  afterAll(async () => {
    await pool.query(`DELETE FROM admin WHERE email = $1`, [
      existingUser.email,
    ]);
    await pool.query(`DELETE FROM admin WHERE email = $1`, [newUser.email]);
    await pool.end();

    console.log("Deleted test admins");
  });

  /*
   * Register API Endpoint
   * 201 on success
   * 400 on email already
   * 400 on username already
   * 401 on register without admin login
  */

  describe("POST /api/admin/register", () => {
    beforeAll(loginExistingUser);

    test("201 on successful registration", async () => {
      const res = await agent.post("/api/admin/register").send(newUser);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("message", "Admin added");
    });

    test("400 on email already registered", async () => {
      const res = await agent.post("/api/admin/register").send({
        username: "sthelse",
        email: existingUser.email,
        password: existingUser.password,
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "Email already exists");
    });

    test("400 on username already registered", async () => {
      const res = await agent.post("/api/admin/register").send({
        username: existingUser.username,
        email: "anything@test.com",
        password: existingUser.password,
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "Username already exists");
    });

    test("401 on register without admin login", async () => {
      const res = await supertest(app)
        .post("/api/admin/register")
        .send(newUser);
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("error", "Unauthorized");
    });
  });

  /*
   * Login API Endpoint
   * 201 on success
   * 401 on invalid credentials
  */

  describe("POST /api/admin/login", () => {
    test("200 on successful login", async () => {
      const res = await supertest(app).post("/api/admin/login").send({
        username: existingUser.username,
        password: existingUser.password,
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message", "Logged in");
    });

    test("401 on invalid credentials", async () => {
      const res = await supertest(app).post("/api/admin/login").send({
        username: existingUser.username,
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

  describe("POST /api/admin/delete", () => {
    beforeAll(loginExistingUser);

    test("204 on successful delete", async () => {
      const res = await agent.delete("/api/admin/delete")

      expect(res.statusCode).toEqual(204)
    });

    test("401 on delete without admin login", async () => {
      const res = await supertest(app).delete("/api/admin/delete");
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("error", "Unauthorized");
    });
  });
});
