export default {
  tiempoLocal: (date) =>
    new Date(new Date(date).getTime() + new Date().getTimezoneOffset() * 60000),

  tiempoMX: (date) =>
    new Date(
      new Date(date).getTime() +
        new Date().getTimezoneOffset() * 60000 -
        1000 * 60 * 60 * 24
    ),

  tiempoLocalShort: (date) =>
    new Intl.DateTimeFormat("es-MX", {
      dateStyle: "short",
    }).format(
      new Date(
        new Date(date).getTime() + new Date().getTimezoneOffset() * 60000
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

  tiempoDB: (f) => new Date(f).toISOString().split("T")[0],

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
};
