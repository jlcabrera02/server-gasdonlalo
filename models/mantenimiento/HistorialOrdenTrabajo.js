import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const HistorialOrdenTrabajo = sequelize.define(
  "ordenes_trabajo_historial",
  {
    idhistorial: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idorden_trabajo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    resultado: {
      type: DataTypes.ENUM("AUTORIZADO", "NO-AUTORIZADO"),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

export default HistorialOrdenTrabajo;
