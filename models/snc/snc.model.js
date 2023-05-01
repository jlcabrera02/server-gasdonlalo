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