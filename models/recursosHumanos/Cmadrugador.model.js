import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const Cmadrugador = sequelize.define(
  "configuraciones_madrugador",
  {
    idconcurso: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    freezeTableName: true,
  }
);

export default Cmadrugador;
