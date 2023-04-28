import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const empleados = sequelize.define(
  "empleado",
  {
    idempleado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    idchecador: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    nombre: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    apellido_paterno: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    apellido_materno: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    iddepartamento: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estatus: {
      type: DataTypes.ENUM(
        "Contrato",
        "Practica",
        "Despido",
        "Rechazado",
        "Pendiente"
      ),
      allowNull: false,
    },
    edad: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    date_baja: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
    },
    fecha_registro: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    motivo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING(25),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default empleados;
