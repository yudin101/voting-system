import { Admin } from "../src/types/admin";
import { Voter } from "../src/types/voter";

export const existingAdmin: Admin = {
  id: 1,
  username: "existingTester",
  email: "existing@test.com",
  password: "existing123",
};

export const newAdmin: Admin = {
  id: 2,
  username: "tester",
  email: "tester@test.com",
  password: "tester123",
};

export const existingVoter: Voter = {
  id: 1,
  first_name: "Steve",
  last_name: "Rogers",
  username: "captain",
  email: "captain@test.com"
}

export const newVoter: Voter = {
  id: 2,
  first_name: "Stephen",
  last_name: "Strange",
  username: "drstrange",
  email: "drstrange@test.com"
}
