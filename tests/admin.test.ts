import supertest, { SuperAgentTest } from "supertest";
import pool from "../src/config/db";
import { existingUser, newUser } from "./constants";
import bcrypt from "bcrypt";
import app from "../src/app";

describe("Admin Info API", () => {
  let agent: SuperAgentTest & ReturnType<typeof supertest.agent>;

  const { password: existingUserPassword, ...existingUserNoPassword } =
    existingUser;
  const { password: newUserPassword, ...newUserNoPassword } = newUser;

  beforeAll(async () => {
    await pool.query(
      `INSERT INTO admin (id, username, email, password)
      VALUES 
        ($1, $2, $3, $4),
        ($5, $6, $7, $8)`,
      [
        existingUser.id,
        existingUser.username,
        existingUser.email,
        await bcrypt.hash(existingUser.password, 10),
        newUser.id,
        newUser.username,
        newUser.email,
        await bcrypt.hash(newUser.password, 10),
      ],
    );

    agent = supertest.agent(app) as SuperAgentTest &
      ReturnType<typeof supertest.agent>;

    await agent
      .post("/api/admin/login")
      .send({
        username: existingUser.username,
        password: existingUser.password,
      })
      .expect(200);
  });

  afterAll(async () => {
    await pool.query(`DELETE FROM admin WHERE email = $1`, [
      existingUser.email,
    ]);
    await pool.query(`DELETE FROM admin WHERE email = $1`, [newUser.email]);
    await pool.end();
  });

  /*
   * Admin Info API Endpoint
   * 200 on success with ID
   * 200 on success with username
   * 200 on email with email
   * 
   * 400 on invalid email format
   *
   * 404 on admin not found with id
   * 404 on admin not found with username
   * 404 on admin not found with email
   *
   * 400 on missing parameters
   *
   * 401 on request without login
   */

  describe("GET /api/admin/info", () => {
    test("200 on get info by ID", async () => {
      const res = await agent.get(`/api/admin/info?id=${existingUser.id}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("admin", existingUserNoPassword);
    });

    test("200 on get info by username", async () => {
      const res = await agent.get(
        `/api/admin/info?username=${newUser.username}`,
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("admin", newUserNoPassword);
    });

    test("200 on get info by email", async () => {
      const res = await agent.get(`/api/admin/info?email=${newUser.email}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("admin", newUserNoPassword);
    });

    test("400 on invalid email format", async () => {
      const res = await agent.get(`/api/admin/info?email=NopeNotAnEmail`);

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

    test("404 on admin not found with id", async () => {
      const res = await agent.get(`/api/admin/info?id=342`);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("error", "Not Found");
    });

    test("404 on admin not found with username", async () => {
      const res = await agent.get(
        `/api/admin/info?username=somenonexistingusername`,
      );

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("error", "Not Found");
    });

    test("404 on admin not found with email", async () => {
      const res = await agent.get(`/api/admin/info?email=notreal@nope.com`);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("error", "Not Found");
    });

    test("400 on missing parameters", async () => {
      const res = await agent.get(`/api/admin/info`);

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "Missing query parameters");
    });

    test("401 on info request without login", async () => {
      const res = await supertest(app).get(
        `/api/admin/info?username=${existingUser.username}`,
      );

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("error", "Unauthorized");
    });
  });
});
