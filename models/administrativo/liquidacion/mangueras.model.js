import { DataTypes } from "sequelize";
import sequelize from "../../../config/configdb";
import Islas from "./islas.model";
import Gas from "./gas.model";

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
    /* idisla: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Islas,
        key: "idisla",
      },
    },
    idgas: {
      type: DataTypes.CHAR,
      allowNull: false,
      references: {
        model: Gas,
        key: "idgas",
      },
    }, */
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

Islas.belongsToMany(Gas, { through: Mangueras, foreignKey: "idisla" });
Gas.belongsToMany(Islas, { through: Mangueras, foreignKey: "idgas" });

export default Mangueras;
