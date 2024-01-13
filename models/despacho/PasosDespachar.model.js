import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const EvPasosDespachar = sequelize.define(
  "evaluacion_despachar",
  {
    idevaluacion_despachar: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    idempleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idpaso_despachar: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    evaluacion: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    identificador: {
      type: DataTypes.CHAR(34),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    updatedAt: false,
    createdAt: "create_time",
  }
);

export const pasosDes = sequelize.define(
  "paso_despachar",
  {
    idpaso_despachar: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    paso: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

EvPasosDespachar.hasMany(pasosDes, {
  foreignKey: "idpaso_despachar",
});
pasosDes.hasMany(EvPasosDespachar, {
  foreignKey: "idpaso_despachar",
});

export default EvPasosDespachar;
