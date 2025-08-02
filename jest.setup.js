const { default: pool } = require("./src/config/db");
const {
  existingAdmin,
  newAdmin,
  existingVoter,
  newVoter,
  existingCandidate,
  newCandidate,
} = require("./tests/constants");
const bcrypt = require("bcrypt");

beforeAll(async () => {
  jest.spyOn(console, "log").mockImplementation(() => { });
  jest.spyOn(console, "error").mockRestore?.();

  await pool.query(
    `INSERT INTO admin (id, username, email, password)
    VALUES ($1, $2, $3, $4)`,
    [
      existingAdmin.id,
      existingAdmin.username,
      existingAdmin.email,
      await bcrypt.hash(existingAdmin.password, 10),
    ],
  );

  await pool.query(
    `INSERT INTO voter (id, first_name, last_name, username, email)
    VALUES ($1, $2, $3, $4, $5)`,
    [
      existingVoter.id,
      existingVoter.first_name,
      existingVoter.last_name,
      existingVoter.username,
      existingVoter.email,
    ],
  );

  await pool.query(
    `INSERT INTO candidate (id, username, first_name, last_name, description)
    VALUES ($1, $2, $3, $4, $5)`,
    [
      existingCandidate.id,
      existingCandidate.username,
      existingCandidate.first_name,
      existingCandidate.last_name,
      existingCandidate.description,
    ],
  );
});

afterAll(async () => {
  jest.restoreAllMocks();

  await pool.query(`DELETE FROM admin WHERE email = $1`, [existingAdmin.email]);
  await pool.query(`DELETE FROM admin WHERE email = $1`, [newAdmin.email]);

  await pool.query(`DELETE FROM voter WHERE email = $1`, [existingVoter.email]);
  await pool.query(`DELETE FROM voter WHERE email = $1`, [newVoter.email]);
  await pool.query(`DELETE FROM voter WHERE email = $1`, ["ohmygod@test.com"]);

  await pool.query(`DELETE FROM candidate WHERE username = $1`, [
    existingCandidate.username,
  ]);
  await pool.query(`DELETE FROM candidate WHERE username = $1`, [
    newCandidate.username,
  ]);
  await pool.query(`DELETE FROM candidate WHERE username = $1`, ["somethingnew"])

  await pool.end();
});
