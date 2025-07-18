import { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";
import pool from "../config/db";

export const addVoter = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      email,
      username,
    } = matchedData(req);

    const checkEmail = await pool.query(
      `SELECT * FROM voter WHERE email = $1`,
      [email],
    );

    if (checkEmail.rows.length > 0) {
      res.status(400).json({
        error: "Voter email already exists",
      });
      return;
    }

    const checkUsername = await pool.query(
      `SELECT * FROM voter WHERE username = $1`,
      [username],
    );

    if (checkUsername.rows.length > 0) {
      res.status(400).json({
        error: "Voter username already exists",
      });
      return;
    }

    if (middleName) {
      await pool.query(
        `INSERT INTO voter (first_name, middle_name, last_name, email, username)
        VALUES ($1, $2, $3, $4, $5)`,
        [firstName, middleName, lastName, email, username],
      );

      res.status(201).json({ message: "Voter added" });
      return;
    }

    await pool.query(
      `INSERT INTO voter (first_name, last_name, email, username)
      VALUES ($1, $2, $3, $4)`,
      [firstName, lastName, email, username],
    );

    res.status(201).json({ message: "Voter added" });
    return;
  } catch (err) {
    console.error(`Error adding voter: ${err}`);
    next(err);
  }
};

export const checkVoter = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let { id, username, email } = matchedData(req);
    id = parseInt(id);

    let queryText = "SELECT * FROM voter WHERE ";
    let queryValue: (string | number)[];

    if (id) {
      queryText += "id = $1";
      queryValue = [id];
    } else if (username) {
      queryText += "username = $1";
      queryValue = [username];
    } else if (email) {
      queryText += "email = $1";
      queryValue = [email];
    } else {
      res.status(400).json({ error: "Missing query parameters" });
      return;
    }

    const voterInfo = await pool.query(queryText, queryValue);

    if (voterInfo.rowCount === 0) {
      res.status(404).json({ error: "Voter not found" });
      return;
    }

    res.status(200).json({ voter: voterInfo.rows[0] });
    return;
  } catch (err) {
    console.error(`Error while checking voter: ${err}`);
    next(err);
  }
};
