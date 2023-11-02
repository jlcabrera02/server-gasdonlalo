import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const panicBtn = sequelize.define(
  "panic_btn",
  {
    idpanic_btn: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    idempleado: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    idisla: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    freezeTableName: true,
  }
);

export default panicBtn;
