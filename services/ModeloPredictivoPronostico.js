import Decimal from "decimal.js-light";
import formatTiempo from "../assets/formatTiempo";

async function prediccionCombustible(data, dias = 7, pedidos) {
  const arrayPronostico = [];
  if (data.length < 1) return arrayPronostico;
  const convertData = JSON.parse(JSON.stringify(data));
  const orderDateDesc = convertData.sort((a, b) =>
    new Date(a) > new Date(b) ? 1 : -1
  );

  const dataLast = orderDateDesc[orderDateDesc.length - 1];
  arrayPronostico.push(dataLast);

  const fechaInit = new Date(dataLast.fecha);
  const ventaPromedio = dataLast.ventas_litros;

  for (let i = 0; i < dias; i++) {
    fechaInit.setDate(fechaInit.getDate() + 1);

    const temp = {
      compra_litros: null,
      gas: dataLast.gas,
      fecha_pedido: null,
      isPedido: false,
      idestacion_servicio: dataLast.idestacion_servicio,
      fecha: formatTiempo.tiempoDB(new Date(fechaInit)),
      ventas_litros: ventaPromedio,
      promedio_ventas_mes: ventaPromedio,
      limite: Number(dataLast.limite),
      combustible: dataLast.combustible,
      registro: "Pronostico",
    };

    temp.existencia_litros = new Decimal(
      new Decimal(arrayPronostico[i].existencia_litros)
        .sub(arrayPronostico[i].ventas_litros)
        .toNumber()
    )
      .add(dataLast.compra_litros || 0)
      .toFixed(2);

    arrayPronostico.push(temp);
  }

  arrayPronostico.shift();
  return arrayPronostico;
}

export default prediccionCombustible;
