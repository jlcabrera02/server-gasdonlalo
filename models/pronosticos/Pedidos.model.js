import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const Pedidos = sequelize.define(
  "pedidos",
  {
    idpedidos: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    combustible: {
      type: DataTypes.CHAR(1),
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

    idestacion_servicio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha_descarga: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    n_lemargo: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    n_conductor: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    litros_descarga: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Pedidos;
