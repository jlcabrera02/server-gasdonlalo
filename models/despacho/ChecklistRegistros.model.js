import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const ChecklistRegistros = sequelize.define(
  "checklistregistros",
  {
    idchecklist: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    idempleado_entrante: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idempleado_saliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idestacion_servicio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idturno: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idisla: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isla_limpia: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    aceites_completos: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    funcionalidad: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    freezeTableName: true,
  }
);

export default ChecklistRegistros;
