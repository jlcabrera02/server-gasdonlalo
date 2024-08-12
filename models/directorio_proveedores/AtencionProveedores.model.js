import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const EvProveedores = sequelize.define(
  "atenciones_proveedor",
  {
    idatenciones: {
      autoIncrement: true,
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
    valoracion: {
      type: DataTypes.ENUM("Excelente", "Regular", "Deficiente"),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

export default EvProveedores;
