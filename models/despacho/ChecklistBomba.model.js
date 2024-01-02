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
    },
    aceites_completos: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    turno: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    bomba: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    estacion_servicio: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
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
    },
    empleado_saliente: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    incidentes: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default ChecklistBomba;
