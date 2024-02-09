import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const Cmadrugador = sequelize.define(
  "concurso_madrugador",
  {
    idconcurso: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha_inicial: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    fecha_final: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    idempleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precio: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false,
    },
    devolucion: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: true,
    },
    sncs: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Cmadrugador;
