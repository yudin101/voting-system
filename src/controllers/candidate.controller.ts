import { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";
import checkExists from "../utils/checkExists";
import pool from "../config/db";
import { Candidate } from "../types/candidate";

export const addCandidate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
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

export const updateCandidate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { username } = req.params;

    const candidate = (await checkExists([
      "candidate",
      "username",
      username,
    ])) as Candidate;

    if (!candidate) {
      res.status(404).json({ error: "Candidate not found" });
      return;
    }

    const candidateId = candidate.id;

    const {
      username: newUsername,
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      description,
    } = matchedData(req);

    const setClauses: string[] = [];
    const queryValues: (string | number)[] = [candidateId];
    let placeholderConuter = 2;

    if (newUsername) {
      const checkUsername = await pool.query(
        `SELECT * FROM candidate WHERE username = $1`,
        [newUsername],
      );

      if (checkUsername.rows.length > 0) {
        res.status(400).json({ error: "Username already exists" });
        return;
      }

      setClauses.push(`username = $${placeholderConuter++}`);
      queryValues.push(newUsername);
    }

    if (firstName) {
      setClauses.push(`first_name = $${placeholderConuter++}`);
      queryValues.push(firstName);
    }

    if (middleName) {
      setClauses.push(`middle_name = $${placeholderConuter++}`);
      queryValues.push(middleName);
    }

    if (lastName) {
      setClauses.push(`last_name = $${placeholderConuter++}`);
      queryValues.push(lastName);
    }

    if (description) {
      setClauses.push(`description = $${placeholderConuter++}`);
      queryValues.push(description);
    }

    const queryText = `UPDATE candidate SET ${setClauses.join(", ")} WHERE id = $1`;

    await pool.query(queryText, queryValues);

    res.status(200).json({ message: "Candidate updated" });
    return;
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const deleteCandidate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { username } = req.params;

    const candidate = (await checkExists([
      "candidate",
      "username",
      username,
    ])) as Candidate;

    if (!candidate) {
      res.status(404).json({ error: "Candidate not found" });
      return;
    }

    const candidateId = candidate.id;

    await pool.query(`DELETE FROM candidate WHERE id = $1`, [candidateId]);

    res.sendStatus(201);
    return;
  } catch (err) {
    console.error(err);
    next();
  }
};

export const checkCandidate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let { id, username } = matchedData(req);
    id = parseInt(id);

    const columns: [string, string, string | number][] = [
      ["candidate", "username", username],
      ["candidate", "id", id],
    ];

    let count = 0;

    for (let i = 0; i < columns.length; i++) {
      if (columns[i][2]) {
        const candidate = await checkExists(columns[i]);

        if (candidate) {
          res.status(200).json({ candidate: candidate });
          return;
        }
        count++;
      }
    }

    if (count === 0) {
      res.status(400).json({ error: "Missing parameters" });
      return;
    }

    res.status(404).json({ error: "Candidate not found" });
    return;
  } catch (err) {
    console.error(err);
    next();
  }
};
