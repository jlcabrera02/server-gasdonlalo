import { DataTypes } from "sequelize";
import sequelize from "../../../config/configdb";

const LecturasFinales = sequelize.define(
  "lecturas_finales",
  {
    idmanguera: {
      type: DataTypes.STRING(3),
      primaryKey: true,
      autoIncrement: true,
    },
    lecturai: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    lecturaf: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    idinfo_lectura: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    createdAt: "createdAt",
    updatedAt: false,
  }
);

export default LecturasFinales;
