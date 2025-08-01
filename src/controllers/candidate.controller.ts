import { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";
import checkExists from "../utils/checkExists";
import pool from "../config/db";

export const addCandidate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      username,
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      description,
    } = matchedData(req);

    if (await checkExists(["candidate", "username", username])) {
      res.status(400).json({ error: "Candidate already exists" });
      return;
    }

    if (middleName) {
      await pool.query(
        `INSERT INTO candidate (username, first_name, middle_name, last_name, description)
        VALUES ($1, $2, $3, $4, $5)`,
        [username, firstName, middleName, lastName, description],
      );

      res.status(201).json({ message: "Candidate Added" });
      return;
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};
