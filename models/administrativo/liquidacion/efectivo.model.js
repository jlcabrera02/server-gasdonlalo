import { DataTypes } from "sequelize";
import sequelize from "../../../config/configdb";

const Efectivo = sequelize.define(
  "efectivo",
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
    idliquidacion: {
      type: DataTypes.INTEGER,
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
    timestamps: false,
  }
);

export default Efectivo;
