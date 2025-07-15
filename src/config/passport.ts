import passport from "passport";
import { Strategy } from "passport-local";
import pool from "./db";
import bcrypt from "bcrypt";
import { Admin } from "../types/passport";

export default passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const adminCheck = await pool.query(
        `SELECT * FROM admin WHERE username = $1`,
        [username],
      );

      const admin = adminCheck.rows[0] as Admin | undefined;

      if (!admin || !(await bcrypt.compare(password, admin["password"]))) {
        return done(null, false, { message: "Invalid Credentials" });
      }

      return done(null, admin);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  return done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const admin = await pool.query(`SELECT * FROM admin WHERE id = $1`, [id]);

    return done(null, admin.rows[0]);
  } catch (err) {
    return done(err);
  }
});
