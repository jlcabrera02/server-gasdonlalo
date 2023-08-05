import Decimal from "decimal.js-light";
const calcularTotal = (datos, propiedad) => {
  const cantidad =
    datos.length > 0
      ? datos
          .map((el) => el[propiedad])
          .reduce((a, b) => new Decimal(a).add(new Decimal(b).toNumber(), 0))
      : 0;
  return Number(cantidad);
};

export default calcularTotal;
