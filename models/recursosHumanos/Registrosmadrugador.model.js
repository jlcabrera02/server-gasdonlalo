import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const Registrosmadrugador = sequelize.define(
  "registros_madrugador",
  {
    idconcurso: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    datos: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    fecha_pago: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    fecha_inicial: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fecha_final: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Registrosmadrugador;
