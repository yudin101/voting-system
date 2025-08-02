import { Voter } from "../types/voter";
import pool from "../config/db";
import { Candidate } from "../types/candidate";

const checkExists = async (
  column: [string, string, string | number],
): Promise<false | Voter | Candidate> => {
  const tableName = column[0];
  const fieldName = column[1];

  const check = await pool.query(
    `SELECT * FROM ${tableName} WHERE ${fieldName} = $1`,
    [column[2]],
  );

  if (check.rows.length > 0) {
    return check.rows[0];
  }
  
  return false;
};

export default checkExists;
