import { connect, connection } from "mongoose";

const URI = process.env.URI as string;

const database = async () => {
  if (!URI) {
    console.warn(`[database] URI is not provided. ${URI}`);
    process.exit(1);
  }
  if (connection.readyState === 1) {
    console.info("[database] Already connected.");
    return;
  }

  try {
    const { connection } = await connect(URI);
    console.info(`[database] ${connection.port}`);
  } catch (error) {
    console.warn(`[database] ${(error as Error).message}`);
    process.exit(1);
  }
};

export default database;
