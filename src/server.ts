import app from "./app";
import { initializeSchema } from "./config/db";
import env from "./config/env";

const startServer = async (): Promise<void> => {
  try {
    await initializeSchema();

    const PORT = env.server_port;

    app.listen(PORT, () => {
      console.log(`Listening on port: ${PORT}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();
