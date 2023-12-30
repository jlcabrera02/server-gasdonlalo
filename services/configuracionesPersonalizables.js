import fs from "fs";
import path from "path";

const file = path.join(__dirname, "../config/configuraciones.json");

export const obtenerConfiguraciones = () => {
  let datos = fs.readFileSync(file);
  datos = JSON.parse(datos);
  return datos;
};

export const escribirConfiguraciones = (configuracion) => {
  let datos = obtenerConfiguraciones();
  datos = { ...datos, ...configuracion };
  fs.writeFileSync(file, JSON.stringify(datos));
};
