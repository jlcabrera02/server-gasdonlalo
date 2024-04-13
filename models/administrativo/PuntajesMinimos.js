import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const PuntajeMin = sequelize.define(
  "puntajes_minimos",
  {
    idpuntajes_minimo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    evaluacion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

export default PuntajeMin;
