import { Schema } from "express-validator";

export const registerValidation: Schema = {
  username: {
    in: ["body"],
    isString: {
      errorMessage: "Username must be a string",
    },
    trim: true,
    isLength: {
      options: {
        max: 50,
      },
      errorMessage: "Username must be within 50 characters",
    },
  },
  email: {
    in: ["body"],
    optional: {
      options: {
        nullable: true,
        checkFalsy: true,
      },
    },
    isString: {
      errorMessage: "Email must be a string",
    },
    trim: true,
    isLength: {
      options: {
        max: 100,
      },
      errorMessage: "Email must be within 100 characters",
    },
    isEmail: {
      errorMessage: "Invalid email format",
    },
    normalizeEmail: true,
  },
  password: {
    in: ["body"],
    isString: {
      errorMessage: "Password must be a string",
    },
    trim: true,
  },
};

export const loginValidation: Schema = {
  username: {
    in: ["body"],
    isString: {
      errorMessage: "Username must be a string",
    },
    trim: true,
  },
  password: {
    in: ["body"],
    isString: {
      errorMessage: "Password must be a string",
    },
    trim: true,
  },
};
