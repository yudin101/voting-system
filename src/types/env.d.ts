declare namespace NodeJS {
  interface ProcessEnv {
    SERVER_PORT: string;
    SESSION_SECRET: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_HOST: string;
    DB_NAME: string;
    DB_PORT: string;
  }
}
