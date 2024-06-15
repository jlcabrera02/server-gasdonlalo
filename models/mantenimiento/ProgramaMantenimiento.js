import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

export const Actividades = sequelize.define("actividades", {
  idactividad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  periodo_actividad: {
    type: DataTypes.ENUM("semanal", "mensual", "cuatrimestral", "anual"),
    allowNull: false,
  },
  observaciones: {
    type: DataTypes.TEXT("medium"),
  },
});

export const FechasActividades = sequelize.define("fechas_actividades", {
  idfechas_actividades: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  fecha_programada: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  fecha_realizada: {
    type: DataTypes.DATEONLY,
  },
  idorden_trabajo: {
    type: DataTypes.INTEGER,
  },
  idactividad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
