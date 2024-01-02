import { DataTypes } from "sequelize";
import sequelize from "../../../config/configdb";

const Liquidaciones = sequelize.define(
  "liquidaciones",
  {
    idliquidacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    lecturas: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    idislas: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    paginacion: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    cancelado: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fechaCancelado: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    capturado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    idempleado_captura: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    idhorario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    num_impresiones: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    show_mf: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    show_ms: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    freezeTableName: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  }
);

Liquidaciones.beforeUpdate((liq) => {
  if (liq["_previousDataValues"].lecturas) {
    throw {
      code: 400,
      msg: "La liquidación ya se capturo o hay una con el mismo folio, por lo que esta liquidación ya no se aceptara en el sistema.",
    };
  }
});

export default Liquidaciones;
