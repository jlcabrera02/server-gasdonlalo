import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const EvProveedores = sequelize.define(
  "actividades_proveedor",
  {
    idactividades: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    idevaluacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cumple: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

export default EvProveedores;
