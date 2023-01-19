const operacionTiempo = {
  restarTiempo: (t, fInicio, fFinal) => {
    let res = new Date(fFinal).getTime() - new Date(fInicio).getTime();
    let tiempo;
    switch (t) {
      case "seconds":
        tiempo = res / 1000;
        break;
      case "minute":
        tiempo = res / (1000 * 60);
        break;
      case "hours":
        tiempo = res / (1000 * 60 * 60);
        break;
      case "days":
        tiempo = res / (1000 * 60 * 60 * 24);
        break;

      default:
        break;
    }
    return tiempo;
  },
};

export default operacionTiempo;
