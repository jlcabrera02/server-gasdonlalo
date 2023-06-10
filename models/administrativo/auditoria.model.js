import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const Auditoria = sequelize.define(
  "auditorias",
  {
    idauditoria: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    peticion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idempleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idaffectado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    accion: {
      type: DataTypes.ENUM("GET", "POST", "PUT", "DELETE"),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    createdAt: "create_time",
    updatedAt: false,
  }
);

export default Auditoria;
