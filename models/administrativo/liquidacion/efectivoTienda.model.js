import { DataTypes } from "sequelize";
import sequelize from "../../../config/configdb";

const EfectivoTienda = sequelize.define(
  "efectivo_tienda",
  {
    idefectivo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    monto: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    folio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    idcodigo_uso: {
      type: DataTypes.CHAR(2),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

export default EfectivoTienda;
