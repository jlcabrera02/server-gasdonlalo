import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const LlaveAcceso = sequelize.define(
  "llaves_acceso",
  {
    idempleado: {
      type: DataTypes.INTEGER,
      unique: true,
    },
    key: {
      type: DataTypes.CHAR(10),
      unique: true,
    },
  },
  {
    freezeTableName: true,
  }
);

LlaveAcceso.removeAttribute("id");

export default LlaveAcceso;
