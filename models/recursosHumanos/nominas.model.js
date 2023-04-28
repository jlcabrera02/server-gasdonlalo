import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const nominas = sequelize.define("nominas", {
  idnomina: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idtipo_nomina: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idempleado: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
});

export const tiposNominas = sequelize.define(
  "tipos_nominas",
  {
    idtipo_nomina: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    banco: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

export default nominas;
