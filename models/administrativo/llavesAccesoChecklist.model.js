import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const LlaveAccesoChecklist = sequelize.define(
  "llaves_acceso_checklist",
  {
    idempleado: {
      type: DataTypes.INTEGER,
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

LlaveAccesoChecklist.removeAttribute("id");

export default LlaveAccesoChecklist;
