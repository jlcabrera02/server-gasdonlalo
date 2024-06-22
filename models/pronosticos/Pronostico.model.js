import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const Pronosticos = sequelize.define(
  "pronosticos",
  {
    idpronostico: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    combustible: {
      type: DataTypes.CHAR(1),
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    registro: {
      type: DataTypes.ENUM("Pronostico", "Real"),
      allowNull: false,
    },
    existencia_litros: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false,
    },
    compra_litros: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: true,
    },
    ventas_litros: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: true,
    },
    idestacion_servicio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    limite: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false,
      comment: "Es el limite que se configuro en el momento",
    },
    promedio_ventas_mes: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false,
    },
    fecha_pedido: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Pronosticos;
