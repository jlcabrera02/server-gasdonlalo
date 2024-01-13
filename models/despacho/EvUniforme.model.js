import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const EvUniforme = sequelize.define(
  "evaluacion_uniforme",
  {
    idevaluacion_uniforme: {
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
    idcumplimiento_uniforme: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idpuntaje_minimo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cumple: {
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
    timestamps: false,
  }
);

export const CumplimientosUniforme = sequelize.define(
  "cumplimiento_uniforme",
  {
    idcumplimiento_uniforme: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cumplimiento: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

EvUniforme.belongsTo(CumplimientosUniforme, {
  foreignKey: "idcumplimiento_uniforme",
});
CumplimientosUniforme.hasMany(EvUniforme, {
  foreignKey: "idcumplimiento_uniforme",
});

export default EvUniforme;
