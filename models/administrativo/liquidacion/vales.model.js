import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const Vales = sequelize.define(
  "vales",
  {
    idvales: {
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
      type: DataTypes.STRING,
      allowNull: true,
    },
    combustible: {
      type: DataTypes.CHAR,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default Vales;
