import { DataTypes } from "sequelize";
import sequelize from "../../../config/configdb";
import calcularTotal from "../../../assets/sumarAlgo";

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
    ventasLitros: {
      type: DataTypes.VIRTUAL,
      get() {
        if (!this.capturado) {
          return { magna: 0, premium: 0, diesel: 0, total: 0 };
        }

        const litros = JSON.parse(this.lecturas);
        const filtrarG = (idgas) => litros.filter((l) => l.idgas === idgas);
        const m = filtrarG("M"),
          p = filtrarG("P"),
          d = filtrarG("D");
        const magna = calcularTotal(m, "litrosVendidos");
        const premium = calcularTotal(p, "litrosVendidos");
        const diesel = calcularTotal(d, "litrosVendidos");
        const total = calcularTotal(litros, "litrosVendidos");
        return { magna, premium, diesel, total };
      },
    },
    totalCalculado: {
      type: DataTypes.VIRTUAL,
      get() {
        if (!this.capturado) {
          return "asd";
        }
        const litros = JSON.parse(this.lecturas);
        return calcularTotal(litros, "importe");
      },
    },
    ventasPesos: {
      type: DataTypes.VIRTUAL,
      get() {
        if (!this.capturado) {
          return 0;
        }
        const efectivo = calcularTotal(this.efectivo, "monto");
        const vales = calcularTotal(this.vales, "monto");
        const total = efectivo + vales;
        return { efectivo, vales, total };
      },
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
