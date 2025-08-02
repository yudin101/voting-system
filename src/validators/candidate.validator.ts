import { Schema } from "express-validator";

export const addCandidateValidation: Schema = {
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
  description: {
    in: ["body"],
    isString: {
      errorMessage: "Description must be a string",
    },
    trim: true,
    isLength: {
      options: {
        max: 1000,
      },
      errorMessage: "Description must be within 1000 characters",
    },
  },
};

export const updateCandidateValidation: Schema = {
  username: {
    in: ["body"],
    optional: true,
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
  first_name: {
    in: ["body"],
    optional: true,
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
    optional: true,
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
  description: {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "Description must be a string",
    },
    trim: true,
    isLength: {
      options: {
        max: 1000,
      },
      errorMessage: "Description must be within 1000 characters",
    },
  },
};

export const checkCandidateValidation: Schema = {
  id: {
    in: ["query"],
    optional: true,
    isString: {
      errorMessage: "ID must be a string",
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
};
