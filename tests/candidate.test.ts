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

  /*
   * Candidate Check API Endpoint
   * 200 on candidate exists with ID
   * 200 on candidate exisits with username
   *
   * 404 on candidate not found with ID
   * 404 on candidate not found with username
   *
   * 400 on missing parameters
   **/

  describe("GET /api/candidate/check", () => {
    const apiUrl = "/api/candidate/check";

    test("200 on candidate exists with ID", async () => {
      const res = await supertest(app).get(
        apiUrl + `?id=${existingCandidate.id}`,
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("candidate");
      expect(res.body.candidate).toEqual(
        expect.objectContaining(existingCandidate),
      );
    });

    test("200 on candidate exists with username", async () => {
      const res = await supertest(app).get(
        apiUrl + `?username=${existingCandidate.username}`,
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("candidate");
      expect(res.body.candidate).toEqual(
        expect.objectContaining(existingCandidate),
      );
    });

    test("404 on candidate not found with ID", async () => {
      const res = await supertest(app).get(apiUrl + `?id=756`);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("error", "Candidate not found");
    });

    test("404 on candidate not found with username", async () => {
      const res = await supertest(app).get(
        apiUrl + `?username=somethingnonexistent`,
      );

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("error", "Candidate not found");
    });
  });

  /*
   * Candidate Update API Endpoint
   * 200 on successful first name update
   * 200 on successful middle name update
   * 200 on successful last name update
   * 200 on successful description update
   * 200 on successful username update
   *
   * 400 on first name not string
   * 400 on first name longer than 100 characters
   * 400 on middle name not string
   * 400 on middle name longer than 100 characters
   * 400 on last name not string
   * 400 on last name longer than 100 characters
   * 400 on username not string
   * 400 on username longer than 50 characters
   *
   * 400 on username already exists
   *
   * 404 on candidate not found
   *
   * 401 on update attempt without login
   * */

  describe("PATCH /api/candidate/update/:username", () => {
    const apiUrl = `/api/candidate/update/${existingCandidate.username}`;

    test("400 on first name not string", async () => {
      const res = await agent.patch(apiUrl).send({
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
      const res = await agent.patch(apiUrl).send({
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
      const res = await agent.patch(apiUrl).send({
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
      const res = await agent.patch(apiUrl).send({
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
      const res = await agent.patch(apiUrl).send({
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
      const res = await agent.patch(apiUrl).send({
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
      const res = await agent.patch(apiUrl).send({
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
      const res = await agent.patch(apiUrl).send({
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

    test("400 on username already exists", async () => {
      const res = await agent.patch(apiUrl).send({
        username: existingCandidate.username,
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "Username already exists");
    });

    test("404 on candidate not found", async () => {
      const res = await agent
        .patch("/api/candidate/update/thisshouldnotexist")
        .send({
          username: "shouldotherwisework",
        });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("error", "Candidate not found");
    });

    test("401 on update attempt without login", async () => {
      const res = await supertest(app).patch(apiUrl).send({
        username: "nonexistent",
      });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("error", "Unauthorized");
    });

    test("200 on successful first name update", async () => {
      const res = await agent.patch(apiUrl).send({
        first_name: "New",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message", "Candidate updated");
    });

    test("200 on successful middle name update", async () => {
      const res = await agent.patch(apiUrl).send({
        middle_name: "Mid",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message", "Candidate updated");
    });

    test("200 on successful last name update", async () => {
      const res = await agent.patch(apiUrl).send({
        last_name: "Last",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message", "Candidate updated");
    });

    test("200 on successful username update", async () => {
      const res = await agent.patch(apiUrl).send({
        username: "somethingnew",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message", "Candidate updated");
    });
  });

  /*
   * Candidate Delete API Endpoint
   * 201 on successful delete
   * 404 on username not found
   * 401 on delete attempt without login
   * */

  describe("DELETE /api/candidate/delete/:username", () => {
    const apirUrl = `/api/candidate/delete/${newCandidate.username}`;

    test("201 on successful delete", async () => {
      const res = await agent.delete(apirUrl);

      expect(res.statusCode).toEqual(201);
    });

    test("404 on username not found", async () => {
      // Using the same username because it will be deleted in the previous test
      const res = await agent.delete(apirUrl);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("error", "Candidate not found");
    });

    test("401 on delete attempt without login", async () => {
      const res = await supertest(app).delete(apirUrl);

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("error", "Unauthorized");
    });
  });
});
