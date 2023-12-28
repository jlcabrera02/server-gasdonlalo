import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const RecursosDespachador = sequelize.define(
  "recursos_despachador",
  {
    idrecurso: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    recurso: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    vigente: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export const RecursosDespachadorEv = sequelize.define(
  "recursos_despachador_ev",
  {
    idevaluacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idempleado: {
      type: DataTypes.INTEGER,
    },
    idrecurso: {
      type: DataTypes.INTEGER,
    },
    evaluacion: {
      type: DataTypes.BOOLEAN,
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

export default RecursosDespachador;
