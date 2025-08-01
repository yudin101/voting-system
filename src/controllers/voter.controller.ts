import { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";
import pool from "../config/db";
import checkExists from "../utils/checkExists";

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

    if (await checkExists(["voter", "email", email])) {
      res.status(400).json({
        error: "Voter email already exists",
      });
      return;
    }

    if (await checkExists(["voter", "username", username])) {
      res.status(400).json({ error: "Voter username already exists" });
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

    const columns: [string, string, string | number][] = [
      ["voter", "id", id],
      ["voter", "username", username],
      ["voter", "email", email],
    ];

    let count = 0;

    /*
     * If none of the variables in the columns array have a value,
     * count will remain zero
     */

    for (let i = 0; i < columns.length; i++) {
      /* Checking if the second index of each array inside columns is defined */
      if (columns[i][2]) {
        const voter = await checkExists(columns[i]);

        if (voter) {
          res.status(200).json({ voter: voter });
          return;
        }
        count++;
      }
    }

    if (count === 0) {
      res.status(400).json({ error: "Missing query parameters" });
      return;
    }

    res.status(404).json({ error: "Voter not found" });
    return;
  } catch (err) {
    console.error(`Error while checking voter: ${err}`);
    next(err);
  }
};

export const updateVoter = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { username } = req.params;

    const voter = await checkExists(["voter", "username", username]);

    if (!voter) {
      res.status(404).json({ error: "Voter not found" });
      return;
    }

    const voterId = voter.id;

    const {
      username: newUsername,
      first_name: newFirstName,
      middle_name: newMiddleName,
      last_name: newLastname,
      email: newEmail,
    } = matchedData(req);

    const setClauses: string[] = [];
    const queryValues: (string | number)[] = [voterId];
    let placeholderCounter = 2;

    if (newUsername) {
      const checkUsername = await pool.query(
        `SELECT * FROM voter WHERE username = $1`,
        [newUsername],
      );

      if (checkUsername.rows.length > 0) {
        res.status(400).json({ error: "Voter username already exists" });
        return;
      }

      setClauses.push(`username = $${placeholderCounter++}`);
      queryValues.push(newUsername);
    }

    if (newFirstName) {
      setClauses.push(`first_name = $${placeholderCounter++}`);
      queryValues.push(newFirstName);
    }

    if (newMiddleName) {
      setClauses.push(`middle_name = $${placeholderCounter++}`);
      queryValues.push(newMiddleName);
    }

    if (newLastname) {
      setClauses.push(`last_name = $${placeholderCounter++}`);
      queryValues.push(newLastname);
    }

    if (newEmail) {
      const checkEmail = await pool.query(
        `SELECT * FROM voter WHERE email = $1`,
        [newEmail],
      );

      if (checkEmail.rows.length > 0) {
        res.status(400).json({ error: "Voter email already exists" });
        return;
      }

      setClauses.push(`email = $${placeholderCounter++}`);
      queryValues.push(newEmail);
    }

    if (setClauses.length === 0) {
      res.status(400).json({
        error: "No fields provided",
      });
      return;
    }

    const queryText = `
        UPDATE voter
        SET ${setClauses.join(", ")}
        WHERE id = $1
        RETURNING id, username, email, first_name, middle_name, last_name; 
    `;

    const result = await pool.query(queryText, queryValues);

    res.status(200).json({
      voter: result.rows[0],
    });
    return;
  } catch (err) {
    console.error(`Error while updating voter: ${err}`);
    next(err);
  }
};

export const deleteVoter = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    const voter = await checkExists(["voter", "id", id]);

    if (!voter) {
      res.status(404).json({ error: "Voter not found" });
      return;
    }

    await pool.query(`DELETE FROM voter WHERE id = $1`, [id]);

    res.sendStatus(201);
    return;
  } catch (err) {
    console.error(`Error deleting voter: ${err}`);
    next(err);
  }
};
