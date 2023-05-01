import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const Incumplimientos = sequelize.define(
  "incumplimiento",
  {
    idincumplimiento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    incumplimiento: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    iddepartamento: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

export default Incumplimientos;
