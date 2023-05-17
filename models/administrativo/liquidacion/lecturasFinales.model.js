import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const LecturasFinales = sequelize.define(
  "lecturas_finales",
  {
    idmanguera: {
      type: DataTypes.STRING(3),
      primaryKey: true,
      autoIncrement: true,
    },
    lectura: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    idinfo_lectura: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    createdAt: "create_time",
    updatedAt: false,
  }
);

export default LecturasFinales;
