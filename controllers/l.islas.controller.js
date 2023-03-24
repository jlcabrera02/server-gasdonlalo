import islaM from "../models/l.islas.model";
import errRes from "../respuestas/error.respuestas";
import auth from "../models/auth.model";
import formatTiempo from "../assets/formatTiempo";
// const { tiempoDB } = formatTiempo;
const { verificar } = auth;
// const { sinRegistro } = errRes;

const controller = {};

controller.findIslas = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idEstacion } = req.params;

    const islas = await islaM.findIslas(idEstacion);
    const gasolinas = [];
    for (let i = 0; i < islas.length; i++) {
      let buscar = gasolinas.some((el) => el.numeroIsla === islas[i].nisla);
      if (buscar) {
        let restar = i - 1;
        let index = restar / 2;
        gasolinas[index].derecha = {
          id: islas[i].id,
          direccion: islas[i].direccion,
          contiene: await consultGas(islas[i].idisla),
        };
      } else {
        gasolinas.push({
          numeroIsla: islas[i].nisla,
          estacion: islas[i].idestacion_servicio,
          izquierda: {
            id: islas[i].id,
            direccion: islas[i].direccion,
            contiene: await consultGas(islas[i].idisla),
          },
        });
      }
    }

    res.status(200).json({ success: true, response: gasolinas });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.insertIslas = async (req, res) => {
  try {
    let user = verificar(req.headers.authorizatison);
    if (!user.success) throw user;
    const { idEstacion } = req.params;

    const islas = await islaM.findIslas(idEstacion);
    const gasolinas = [];
    for (let i = 0; i < islas.length; i++) {
      let buscar = gasolinas.some((el) => el.numeroIsla === islas[i].nisla);
      if (buscar) {
        let restar = i - 1;
        let index = restar / 2;
        gasolinas[index].derecha = {
          id: islas[i].id,
          direccion: islas[i].direccion,
          contiene: await consultGas(islas[i].idisla),
        };
      } else {
        gasolinas.push({
          numeroIsla: islas[i].nisla,
          estacion: islas[i].idestacion_servicio,
          izquierda: {
            id: islas[i].id,
            direccion: islas[i].direccion,
            contiene: await consultGas(islas[i].idisla),
          },
        });
      }
    }

    res.status(200).json({ success: true, response: gasolinas });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

async function consultGas(id) {
  let m = await islaM.findEstacionYTipos(id, "M"),
    p = await islaM.findEstacionYTipos(id, "P"),
    d = await islaM.findEstacionYTipos(id, "D");
  return {
    m,
    p,
    d,
  };
}

export default controller;
