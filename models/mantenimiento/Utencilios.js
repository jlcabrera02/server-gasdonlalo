import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const Utencilios = sequelize.define(
  "utencilios_ot",
  {
    idutencilio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    utencilio: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    costo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Utencilios;
