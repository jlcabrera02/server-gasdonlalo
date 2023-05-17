import { DataTypes } from "sequelize";
import sequelize from "../../../config/configdb";

const Vales = sequelize.define(
  "vales",
  {
    idvale: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    idliquidacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    folio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    combustible: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING(8),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default Vales;
