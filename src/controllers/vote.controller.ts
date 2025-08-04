import { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";
import checkExists from "../utils/checkExists";
import pool from "../config/db";

export const vote = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { voter_id: voterId, candidate_id: candidateId } = matchedData(req);

    if (!(await checkExists(["voter", "id", voterId]))) {
      res.status(404).json({
        error: "Voter not found",
      });
      return;
    }

    if (!(await checkExists(["candidate", "id", candidateId]))) {
      res.status(404).json({
        error: "Candidate not found",
      });
      return;
    }

    const checkAlreadyVoted = await pool.query(
      `SELECT * FROM votes WHERE voter_id = $1`,
      [voterId],
    );

    if (checkAlreadyVoted.rows.length > 0) {
      res.status(400).json({
        error: "Voter already voted",
      });
      return;
    }

    await pool.query(
      `INSERT INTO votes (candidate_id, voter_id) VALUES ($1, $2)`,
      [candidateId, voterId],
    );

    res.status(200).json({
      message: "Voted Successfully",
    });
    return;
  } catch (err) {
    console.error(err);
    next();
  }
};
