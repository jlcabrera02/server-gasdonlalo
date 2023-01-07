export default {
  tiempoLocal: (date) =>
    new Date(new Date(date).getTime() + new Date().getTimezoneOffset() * 60000),

  tiempoLocalShort: (date) =>
    new Intl.DateTimeFormat("es-MX", {
      dateStyle: "short",
    }).format(
      new Date(
        new Date(date).getTime() + new Date().getTimezoneOffset() * 60000
      )
    ),

  tiempoDB: (f) => new Date(f).toISOString().split("T")[0],

  diff: (f, h) => new Date(`${f} ${h}`),

  transformMinute: (m) => {
    console.log(m);
    let minutos = Math.abs(m / (1000 * 60));
    let segundo = Math.abs((m % (1000 * 60)) / 1000);
    console.log(`${minutos} minutos y ${segundo} segundos`);
    console.log(minutos % 1000);

    return `${Math.trunc(minutos)}:${segundo}`;

    return new Intl.DateTimeFormat("en", {
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(m));
  },
};
