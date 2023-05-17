import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const InfoLect = sequelize.define(
  "info_lecturas",
  {
    idinfo_lectura: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    idhorario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idliquidacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    createdAt: "create_time",
    updatedAt: false,
  }
);

export default InfoLect;
