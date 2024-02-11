import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const CatInc = sequelize.define(
  "categorizar_incumplimiento",
  {
    idconcurso: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    idincumplimiento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default CatInc;
