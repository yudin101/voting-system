import { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";
import pool from "../config/db";
import bcrypt from "bcrypt";

export const registerAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { username, email, password } = matchedData(req);

    try {
      const checkExistingEmail = await pool.query(
        `SELECT * FROM admin WHERE email = $1`,
        [email],
      );

      if (checkExistingEmail.rows.length > 0) {
        res.status(400).json({ error: "Email already exists" });
        return;
      }

      const checkExistingUsername = await pool.query(
        `SELECT * FROM admin WHERE username = $1`,
        [username],
      );

      if (checkExistingUsername.rows.length > 0) {
        res.status(400).json({ error: "Username already exists" });
        return;
      }

      await pool.query(
        `INSERT INTO admin (username, email, password)
        VALUES ($1, $2, $3)`,
        [username, email, await bcrypt.hash(password, 10)],
      );

      res.status(201).json({ message: "Admin added" });
      return;
    } catch (err) {
      throw err;
    }
  } catch (err) {
    console.error(`Error during admin registration: ${err}`);
    next(err);
  }
};

export const loginAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    res.status(200).json({ message: "Logged in" });
    return;
  } catch (err) {
    console.error(`Error during admin login: ${err}`);
    next(err);
  }
};

export const logoutAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    req.session.destroy((err) => {
      if (err) {
        throw err;
      }

      res
        .clearCookie("connect.sid")
        .status(200)
        .json({ message: "Logged out" });
      return;
    });
  } catch (err) {
    console.error(`Error during admin logout: ${err}`);
    next(err);
  }
};
