import { Schema } from "express-validator";

export const getInfoValidation: Schema = {
  id: {
    in: ["query"],
    optional: true,
    isString: {
      errorMessage: "ID must be passed as a string",
    },
    trim: true,
  },
  username: {
    in: ["query"],
    optional: true,
    isString: {
      errorMessage: "Username must be a string",
    },
    trim: true,
  },
  email: {
    in: ["query"],
    optional: true,
    isString: {
      errorMessage: "Email must be a string",
    },
    trim: true,
    isEmail: {
      errorMessage: "Invalid email format",
    },
    normalizeEmail: true,
  },
};
