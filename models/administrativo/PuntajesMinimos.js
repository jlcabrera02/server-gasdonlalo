import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

//Puntajes Minimos
/* tendencia_oyl;
tendencia_evaluacion_uniforme;
tendencia_pasos_despacho;
tendencia_recursos_despachador;
cantidad_minima_recursos_despachador; */

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
