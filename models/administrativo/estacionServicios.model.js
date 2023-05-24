import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const ES = sequelize.define(
  "estacion_servicio",
  {
    idestacion_servicio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitud: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: true,
    },
    longitud: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: true,
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default ES;
