import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const TrabajosMantenimiento = sequelize.define(
  "areas_trabajo",
  {
    idmantenimiento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    area_mantenimiento: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

export default TrabajosMantenimiento;
