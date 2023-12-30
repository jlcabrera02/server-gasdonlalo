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
    quincena: {
      type: DataTypes.VIRTUAL,
      get() {
        const dayOfMonth = new Date(this.fecha).getDate();
        return dayOfMonth <= 15 ? 1 : 2;
      },
    },
  },
  {
    freezeTableName: true,
  }
);

// Registro.prototype.quincena = function () {
//   const dayOfMonth = this.getDataValue("fecha").getDate();
//   return dayOfMonth <= 15 ? "Primera quincena" : "Segunda quincena";
// };

export default RecursosDespachador;
