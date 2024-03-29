import { DataTypes } from "sequelize";
import sequelize from "../../../config/configdb";

const Precios = sequelize.define(
  "precios",
  {
    idprecio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    idgas: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    idempleado_captura: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Precios;
