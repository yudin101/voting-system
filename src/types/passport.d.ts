import { Admin } from "./admin";

declare global {
  namespace Express {
    interface User extends Admin {}
  }
}
