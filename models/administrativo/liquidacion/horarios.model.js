import { DataTypes } from "sequelize";
import sequelize from "../../../config/configdb";

const Horarios = sequelize.define(
  "horarios",
  {
    idhorario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idempleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idturno: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fechaturno: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fechaliquidacion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    idestacion_servicio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  }
);

export default Horarios;
