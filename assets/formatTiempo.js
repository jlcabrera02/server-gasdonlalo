import agruparArr from "./agruparArr";

export default {
  tiempoLocal: (date) =>
    new Date(new Date(date).getTime() + new Date().getTimezoneOffset() * 60000),

  formatHours: (date, convert = true) =>
    new Intl.DateTimeFormat("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      // hour12: true,
    }).format(
      new Date(
        convert
          ? new Date(date).getTime() + new Date().getTimezoneOffset() * 60000
          : date
      )
    ),

  tiempoHora: (date) =>
    new Date(
      new Date(
        new Date(date).getTime() + new Date().getTimezoneOffset() * 60000
      ).getTime()
    ),

  tiempoMX: (date) =>
    new Date(
      new Date(date).getTime() +
        new Date().getTimezoneOffset() * 60000 -
        1000 * 60 * 60 * 24
    ),

  tiempoLocalShort: (date, local) =>
    new Intl.DateTimeFormat("es-MX", {
      dateStyle: "short",
    }).format(
      new Date(
        local
          ? new Date(date).getTime() - new Date().getTimezoneOffset() * 60000
          : new Date(date).getTime() + new Date().getTimezoneOffset() * 60000
      )
    ),
  formatMes: (date) =>
    new Intl.DateTimeFormat("es-MX", {
      month: "long",
    }).format(
      new Date(
        new Date(date).getTime() + new Date().getTimezoneOffset() * 60000
      )
    ),

  tiempoDB: (f, local) =>
    local
      ? new Date(new Date(f).getTime() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .split("T")[0]
      : new Date(f).toISOString().split("T")[0],

  tiempoDBComplete: (f) => {
    const parsetDate = new Date(f);

    return `${parsetDate.getFullYear()}-${
      parsetDate.getMonth() + 1
    }-${parsetDate.getDate()} ${parsetDate.getHours()}:${parsetDate.getMinutes()}:${parsetDate.getSeconds()}`;
  },

  diff: (f, h) => new Date(`${f} ${h}`),

  tiempoHorario: (date) =>
    new Date(
      new Date(date).getTime() +
        new Date().getTimezoneOffset() * 60000 -
        1000 * 60 * 60 * 12
    ),

  transformMinute: (m) => {
    let minutos = Math.abs(m / (1000 * 60));
    let segundo = Math.abs((m % (1000 * 60)) / 1000);
    minutos =
      Math.trunc(minutos).toString().split() > 1 ? minutos : `0${minutos}`;
    segundo = segundo.toString().split() > 1 ? segundo : `0${segundo}`;

    return `${minutos}:${segundo}`;
  },

  formatDinero: (monto) =>
    Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(monto),

  zFill: (cantidad) => {
    const a = pad(Number(cantidad), 7);
    const b = a.split("").slice(0, 7).join("");
    return b;
  },
  orderMangueras: (arraIn, props) => {
    const property = props ? props.property || null : null;
    const arraOut = [];
    if (arraIn.length === 0) return { array: arraOut, object: () => {} };

    const mangueras = arraIn.map((el) => (property ? el[property] : el));

    const convertMayus = mangueras.map((manguera) => manguera.toUpperCase());
    const posiciones = convertMayus.map((manguera) => ({
      posicion: Number(manguera.replace(/\w/, "")),
      manguera: manguera.charAt(),
    }));

    const totalPosiciones = agruparArr(posiciones, (el) => el.posicion)
      .keys()
      .map((el) => Number(el))
      .sort();

    const findM = (data, property, Gas) =>
      data.find((el) =>
        property
          ? el[property] === `${Gas.manguera}${Gas.posicion}`
          : el === `${Gas.manguera}${Gas.posicion}`
      );

    totalPosiciones.forEach((p) => {
      const manguera = posiciones.filter((el) => el.posicion === p);
      const D = manguera.find((el) => el.manguera === "D");
      const M = manguera.find((el) => el.manguera === "M");
      const P = manguera.find((el) => el.manguera === "P");
      if (D) arraOut.push(findM(arraIn, property, D));
      if (M) arraOut.push(findM(arraIn, property, M));
      if (P) arraOut.push(findM(arraIn, property, P));
    });

    const convertToObject = () =>
      arraOut.map((el) => ({
        [el[property] || el]: arraIn.find((manguera) =>
          property
            ? manguera[property] === el[property]
            : manguera[property] === el
        ),
      }));

    return { array: arraOut, object: convertToObject };
  },
};

function pad(n, width, z) {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
