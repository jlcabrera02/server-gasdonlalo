import { DataTypes } from "sequelize";
import sequelize from "../../../config/configdb";

const ControlVol = sequelize.define(
  "control_volumetrico",
  {
    idpreliquidacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    litros: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: true,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    idestacion_servicio: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  }
);

export default ControlVol;
