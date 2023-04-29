import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const detalles = sequelize.define(
  "detalles",
  {
    iddetalle: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idempleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idtipo_nomina: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

export default detalles;
