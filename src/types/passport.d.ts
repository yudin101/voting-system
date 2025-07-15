export interface Admin {
  id: number;
  username: string;
  email: string;
  password: string;
}

declare global {
  namespace Express {
    interface User extends Admin {}
  }
}
