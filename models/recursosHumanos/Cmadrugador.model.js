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
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment:
        "esta fecha servira para localizar en que semana esta el rango de fecha",
    },
    idempleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precio: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeDestroy: (data, options) => {
        console.log(data);
        return true;
      },
    },
    freezeTableName: true,
  }
);

export default Cmadrugador;
