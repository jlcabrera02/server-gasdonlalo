import { DataTypes } from "sequelize";
import sequelize from "../../../config/configdb";

const Preliquidaciones = sequelize.define(
  "preliquidaciones",
  {
    idpreliquidacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    lecturas: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    efectivo: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    vales: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    idempleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idturno: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fechaturno: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idestacion_servicio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  }
);

export default Preliquidaciones;
