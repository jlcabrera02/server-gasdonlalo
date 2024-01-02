import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const OyL = sequelize.define(
  "oyl",
  {
    idoyl: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    isla: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idestacion_servicio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idempleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idoyl_cumplimiento: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idturno: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    identificador: {
      type: DataTypes.CHAR(34),
      allowNull: false,
    },
    cumple: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    incidentes: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export const CumplimientosOyL = sequelize.define(
  "oyl_cumplimiento",
  {
    idoyl_cumplimiento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cumplimiento: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parte: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

OyL.hasMany(CumplimientosOyL, { foreignKey: "idoyl_cumplimiento" });
CumplimientosOyL.hasMany(OyL, { foreignKey: "idoyl_cumplimiento" });

export default OyL;
