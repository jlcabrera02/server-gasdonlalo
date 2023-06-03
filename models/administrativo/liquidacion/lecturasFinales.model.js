import { DataTypes } from "sequelize";
import sequelize from "../../../config/configdb";
import Mangueras from "./mangueras.model";
import InfoLect from "./infoLecturas.model";

const LecturasFinales = sequelize.define(
  "lecturas_finales",
  {
    lecturai: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lecturaf: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precio: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false,
    },
    importe: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    createdAt: "createdAt",
    updatedAt: false,
  }
);

InfoLect.belongsToMany(Mangueras, {
  through: LecturasFinales,
  foreignKey: "idinfo_lectura",
});
Mangueras.belongsToMany(InfoLect, {
  through: LecturasFinales,
  foreignKey: "idmanguera",
});

export default LecturasFinales;
