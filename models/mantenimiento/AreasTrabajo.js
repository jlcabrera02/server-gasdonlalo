import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const AreasTrabajo = sequelize.define(
  "areas_trabajo",
  {
    idarea: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    area: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    idmantenimiento: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

export default AreasTrabajo;
