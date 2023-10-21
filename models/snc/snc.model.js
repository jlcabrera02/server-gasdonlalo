import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const SNC = sequelize.define(
  "salida_noconforme",
  {
    idsalida_noconforme: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    idempleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    idempleado_autoriza: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    idincumplimiento: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    descripcion_falla: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    acciones_corregir: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    concesiones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    createdAt: "create_time",
    updatedAt: false,
    freezeTableName: true,
  }
);

export default SNC;
