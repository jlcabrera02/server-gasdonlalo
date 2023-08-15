import { DataTypes } from "sequelize";
import sequelize from "../../../config/configdb";

const CodigosUso = sequelize.define(
  "codigos_uso",
  {
    idcodigo_uso: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

export default CodigosUso;
