import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const Pagare = sequelize.define(
  "pagares",
  {
    idpagare: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    monto: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false,
    },
    idempleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Pagare;
