import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const detalles = sequelize.define(
  "detalles",
  {
    idempleado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
