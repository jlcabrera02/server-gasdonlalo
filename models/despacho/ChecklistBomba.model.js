import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const ChecklistBomba = sequelize.define(
  "checklist_bomba",
  {
    idchecklist_bomba: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    isla_limpia: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    aceites_completos: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    turno: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    bomba: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    estacion_servicio: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    idempleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idempleado_saliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fechac: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    empleado_saliente: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    empleado_entrante: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    incidentes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default ChecklistBomba;
