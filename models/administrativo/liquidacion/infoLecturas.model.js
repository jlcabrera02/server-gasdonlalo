import { DataTypes } from "sequelize";
import sequelize from "../../../config/configdb";

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
    idliquidacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idestacion_servicio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cancelado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    freezeTableName: true,
    createdAt: "createdAt",
    updatedAt: false,
  }
);

export default InfoLect;
