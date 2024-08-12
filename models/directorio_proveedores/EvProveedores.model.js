import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const EvProveedores = sequelize.define(
  "evaluaciones_proveedores",
  {
    idevaluacion: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    idproveedor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    calificacion_obtenida: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    resultado: {
      type: DataTypes.ENUM("aprobado", "condicionado", "no aprobado"),
      allowNull: false,
    },
    idempleado_evaluador: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

export default EvProveedores;
