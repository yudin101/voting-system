import dotenv from "dotenv";
dotenv.config({ quiet: true });

const env = {
  server_port: parseInt(process.env.SERVER_PORT, 10),
  session_secret: process.env.SESSION_SECRET,
  db_user: process.env.DB_USER,
  db_password: process.env.DB_PASSWORD,
  db_host: process.env.DB_HOST,
  db_name: process.env.DB_NAME,
  db_port: parseInt(process.env.DB_PORT, 10),
};

export default env;
