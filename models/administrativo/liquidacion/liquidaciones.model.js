import { DataTypes } from "sequelize";
import sequelize from "../../../config/configdb";

const Liquidaciones = sequelize.define(
  "liquidaciones",
  {
    idliquidacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    lecturas: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    paginacion: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    cancelado: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fechaCancelado: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    capturado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    idempleado_captura: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    idhorario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default Liquidaciones;
