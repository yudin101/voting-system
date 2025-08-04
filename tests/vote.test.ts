import supertest, { SuperAgentTest } from "supertest";
import app from "../src/app";
import { existingVoter, existingCandidate, newCandidate } from "./constants";

describe("Voting API", () => {
  /*
   * Voting API Endpoint
   * 200 on voted successfully
   *
   * 400 on voter already voted
   * 400 on candidate_id not number
   * 400 on voter_id not number
   *
   * 404 on candidate not found
   * 404 on voter not found
   * */

  describe("POST /api/vote", () => {
    const apiUrl = "/api/vote";

    test("200 on voted successfully", async () => {
      const res = await supertest(app).post(apiUrl).send({
        voter_id: existingVoter.id,
        candidate_id: existingCandidate.id,
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message", "Voted Successfully");
    });

    test("400 on voter already voted", async () => {
      const res = await supertest(app).post(apiUrl).send({
        voter_id: existingVoter.id,
        candidate_id: existingCandidate.id,
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "Voter already voted");
    });

    test("400 on candidate_id not number", async () => {
      const res = await supertest(app).post(apiUrl).send({
        voter_id: existingVoter.id,
        candidate_id: true,
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error[0]).toEqual(
        expect.objectContaining({
          msg: "Candidate ID must be a number",
          path: "candidate_id",
          location: "body",
        }),
      );
    });

    test("400 on voter_id not number", async () => {
      const res = await supertest(app).post(apiUrl).send({
        voter_id: true,
        candidate_id: existingCandidate.id,
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error[0]).toEqual(
        expect.objectContaining({
          msg: "Voter ID must be a number",
          path: "voter_id",
          location: "body",
        }),
      );
    });

    test("404 on candidate not found", async () => {
      const res = await supertest(app).post(apiUrl).send({
        voter_id: existingVoter.id,
        candidate_id: 10000,
      });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("error", "Candidate not found");
    });

    test("404 on voter not found", async () => {
      const res = await supertest(app).post(apiUrl).send({
        voter_id: 10000,
        candidate_id: existingCandidate.id,
      });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("error", "Voter not found");
    });
  });
});
