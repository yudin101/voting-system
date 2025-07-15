import express, { Application, Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import env from "./config/env";
import pool from "./config/db";
import routes from "./routes/index";
import passport from "./config/passport";
import { log } from "./middlewares/log.middleware";

const app: Application = express();
app.use(express.json());

const PGSessionStore = connectPgSimple(session);

app.use(
  session({
    store: new PGSessionStore({
      pool: pool,
    }),
    secret: env.session_secret,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 1000,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use(log);
app.use("/api", routes);

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: "Internal Server Error" });
  return;
});

export default app;
