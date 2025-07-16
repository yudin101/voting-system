import { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";
import pool from "../config/db";

export const getAdminInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let { id, username, email } = matchedData(req);
    let queryText = "SELECT * FROM admin WHERE ";
    let queryValue: (string | number)[];

    id = parseInt(id);

    try {
      if (id) {
        queryText += `id = $1`;
        queryValue = [id];
      } else if (username) {
        queryText += `username = $1`;
        queryValue = [username];
      } else if (email) {
        queryText += `email = $1`;
        queryValue = [email];
      } else {
        res.status(400).json({ error: "Missing query parameters" });
        return;
      }

      const adminInfo = await pool.query(queryText, queryValue);

      if (adminInfo.rowCount === 0) {
        res.status(404).json({ error: "Not Found" });
        return;
      }

      const { password, ...admin } = adminInfo.rows[0];

      res.status(200).json({ admin: admin });
      return;
    } catch (err) {
      throw err;
    }
  } catch (err) {
    console.error(`Error getting admin info: ${err}`);
    next(err);
  }
};
