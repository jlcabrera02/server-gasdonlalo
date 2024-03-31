import { DataTypes } from "sequelize";
import sequelize from "../../../config/configdb";
import calcularTotal from "../../../assets/sumarAlgo";
import Decimal from "decimal.js-light";

const LiquidacionesV2 = sequelize.define(
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
    entregado: {
      type: DataTypes.VIRTUAL,
      get() {
        const vales = this.vales_entregado || 0,
          efectivo = this.efectivo_entregado || 0;
        return calcularTotal([vales, efectivo]);
      },
    },
    calculados: {
      type: DataTypes.VIRTUAL,
      get() {
        const lecturas = this.lecturas ? JSON.parse(this.lecturas) : [];
        const calcularL = (gas) =>
          calcularTotal(
            lecturas.filter((el) => el.idgas === gas),
            "litrosVendidos"
          );

        const calcularP = (gas) =>
          calcularTotal(
            lecturas.filter((el) => el.idgas === gas),
            "importe"
          );

        const ML = calcularL("M"),
          PL = calcularL("P"),
          DL = calcularL("D");

        const MP = calcularP("M"),
          PP = calcularP("P"),
          DP = calcularP("D");

        return {
          litros: { M: ML, P: PL, D: DL, total: calcularTotal([ML, PL, DL]) },
          pesos: { M: MP, P: PP, D: DP, total: calcularTotal([MP, PP, DP]) },
        };
      },
    },
    efectivo_entregado: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: true,
    },
    vales_entregado: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: true,
    },
    diferencia: {
      type: DataTypes.VIRTUAL,
      get() {
        if (this.capturado) {
          const calculado = this.calculados.pesos.total,
            entregado = this.entregado;
          return new Decimal(calculado).sub(entregado).toNumber();
        }
        return 0;
      },
    },
  },
  {
    freezeTableName: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  }
);

LiquidacionesV2.beforeUpdate((liq) => {
  if (liq["_previousDataValues"].lecturas) {
    throw {
      code: 400,
      msg: "La liquidación ya se capturo o hay una con el mismo folio, por lo que esta liquidación ya no se aceptara en el sistema.",
    };
  }
});

export default LiquidacionesV2;
