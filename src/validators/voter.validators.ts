import { Schema } from "express-validator";

export const addVoterValidation: Schema = {
  first_name: {
    in: ["body"],
    isString: {
      errorMessage: "First name must be a string",
    },
    trim: true,
    isLength: {
      options: {
        max: 100,
      },
      errorMessage: "First name must be within 100 characters",
    },
  },
  middle_name: {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "Middle name must be a string",
    },
    trim: true,
    isLength: {
      options: {
        max: 100,
      },
      errorMessage: "Middle name must be within 100 characters",
    },
  },
  last_name: {
    in: ["body"],
    isString: {
      errorMessage: "Last name must be a string",
    },
    trim: true,
    isLength: {
      options: {
        max: 100,
      },
      errorMessage: "Last name must be within 100 characters",
    },
  },
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
  },
};

export const checkVoterValidation: Schema = {
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
      errorMessage: "Username must be a string",
    },
    trim: true,
    isEmail: {
      errorMessage: "Invalid email format",
    },
  },
};
