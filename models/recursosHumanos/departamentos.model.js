import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const departamentos = sequelize.define(
  "departamento",
  {
    iddepartamento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    departamento: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default departamentos;
