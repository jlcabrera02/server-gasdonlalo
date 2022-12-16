import mysql2 from "mysql2";
import { config } from "dotenv";
config(); //
//Establecer conexion con la base de datos;

const connection = mysql2.createConnection({
  host: process.env.HOST_DB,
  user: process.env.USER_DB,
  password: process.env.PASSWORD_DB,
  database: process.env.DATABASE,
  port: process.env.PORT_DB,
});

//funcion que me ayuda a abrir la conexion, ejecutar una callback y cerrar la conexion a la base de datos;
export function conn() {
  connection.connect();
  connection.end();
}

export default connection;
