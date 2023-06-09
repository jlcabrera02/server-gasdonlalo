import { Sequelize } from "sequelize";
import { config } from "dotenv";
config();

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USER_DB,
  process.env.PASSWORD_DB,
  { host: process.env.HOST_DB, dialect: "mysql", timezone: "-06:00" }
);

export default sequelize;
