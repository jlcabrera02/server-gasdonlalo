import { DataTypes } from "sequelize";
import sequelize from "../../../config/configdb";

const Gas = sequelize.define(
  "gas",
  {
    idgas: {
      type: DataTypes.CHAR,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(7),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default Gas;
