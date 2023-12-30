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
    tipo_utencilio: {
      type: DataTypes.ENUM("Herramienta", "Insumo"),
      allowNull: false,
    },
    medida: {
      type: DataTypes.ENUM("Litro", "Kilogramo", "Metro", "Unidad", "Hora"),
      allowNull: false,
      defaultValue: "unidad",
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
