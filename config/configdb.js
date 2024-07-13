import { Sequelize } from "sequelize";
import { config } from "dotenv";
config();

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USER_DB,
  process.env.PASSWORD_DB,
  {
    host: process.env.HOST_DB,
    dialect: "mysql",
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
    timezone: "-06:00",
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Conectado a la base de datos correctamente");
  })
  .catch((err) => {
    console.log("Error en la conexión hacia la base de datos:", err);
  });

export default sequelize;
