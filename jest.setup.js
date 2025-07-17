const { default: pool } = require("./src/config/db");
const { existingAdmin, newAdmin, existingVoter, newVoter } = require("./tests/constants");
const bcrypt = require("bcrypt");

beforeAll(async () => {
  jest.spyOn(console, "log").mockImplementation(() => { });

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
      existingVoter.firstName,
      existingVoter.lastName,
      existingVoter.username,
      existingVoter.email,
    ],
  );
});

afterAll(async () => {
  jest.restoreAllMocks();

  await pool.query(`DELETE FROM admin WHERE email = $1`, [existingAdmin.email]);
  await pool.query(`DELETE FROM admin WHERE email = $1`, [newAdmin.email]);

  await pool.query(`DELETE FROM voter WHERE email = $1`, [existingVoter.email]);
  await pool.query(`DELETE FROM admin WHERE email = $1`, [newVoter.email]);

  await pool.end();
});
