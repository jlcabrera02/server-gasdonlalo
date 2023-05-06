import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const Turnos = sequelize.define(
  "turno",
  {
    idturno: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    turno: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    hora_empiezo: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    hora_termino: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    hora_anticipo: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    mostrar: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default Turnos;
