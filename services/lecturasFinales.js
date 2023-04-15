import lecM from "../models/l.lecturas.model";
import islaM from "../models/l.lecturas.model";
export const insertLecturasFinales = async (data, idEstacion, fecha, folio) => {
  const lastFolio = await lecM.lastFolioEstacion(idEstacion);
  const lecturasIniciales = await islaM.lecturasByFolio(lastFolio);
  let formatearDatos = {};
  lecturasIniciales.forEach((el) => {
    formatearDatos[el.idmanguera] = {
      manguera: el.idmanguera,
      lectura: el.lectura,
      fecha,
      folio,
    };
  });

  data.forEach((el) => {
    formatearDatos[el.manguera] = {
      manguera: el.manguera,
      lectura: el.lecturaFinal,
      fecha,
      folio,
    };
  });

  let cuerpo = Object.values(formatearDatos).map((el) => [
    el.manguera,
    el.lectura,
    el.fecha,
    el.folio,
  ]);

  const guardarLecturaFinal = await lecM.insertLecturasIniciales(cuerpo);

  return guardarLecturaFinal;
};
