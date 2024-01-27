import { config } from "dotenv";
import chalk from "chalk";
import { connect } from "mongoose";

config();
const URI = process.env.URI;

const database = async () => {
  const connection = await connect(URI);
  console.log(chalk.cyan(`[database] ${connection.connection.port}`));
  try {
  } catch (error) {
    console.log(chalk.magenta(`[database] ${error.message}`));
    process.exit();
  }
};

export default database;
