import { Schema } from "express-validator";

export const votingValidation: Schema = {
  candidate_id: {
    in: ["body"],
    isNumeric: {
      errorMessage: "Candidate ID must be a number",
    },
  },
  voter_id: {
    in: ["body"],
    isNumeric: {
      errorMessage: "Voter ID must be a number",
    },
  },
};
