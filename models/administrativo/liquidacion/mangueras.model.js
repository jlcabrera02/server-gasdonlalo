import { DataTypes } from "sequelize";
import sequelize from "../../../config/configdb";

const Mangueras = sequelize.define(
  "mangueras",
  {
    idmanguera: {
      type: DataTypes.STRING(2),
      primaryKey: true,
    },
    tiene: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    idisla: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idgas: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    direccion: {
      type: DataTypes.ENUM("iz", "dr"),
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default Mangueras;
