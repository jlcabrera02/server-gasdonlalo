import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const Horario = sequelize.define(
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
    fechaTurno: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fechaLiquidacion: {
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
  }
);

export default Horario;
