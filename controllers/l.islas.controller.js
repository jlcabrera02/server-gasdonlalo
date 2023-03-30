import islaM from "../models/l.islas.model";
import { guardarBitacora } from "../models/auditorias";
// import errRes from "../respuestas/error.respuestas";
import auth from "../models/auth.model";
// import formatTiempo from "../assets/formatTiempo";
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
          habilitada: islas[i].habilitada && islas[i + 1].habilitada,
          izquierda: {
            id: islas[i].id,
            direccion: islas[i].direccion,
            contiene: await consultGas(islas[i].idisla),
          },
        });
      }
    }

    await guardarBitacora([
      "buscar isla",
      user.token.data.datos.idempleado,
      1,
      null,
    ]);

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
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { numeroIsla, idEstacion } = req.body;

    const insertIsla = await islaM.insertIsla(numeroIsla, idEstacion);
    await islaM.insertGas(insertIsla.insertId);
    await islaM.insertGas(insertIsla.insertId + 1);

    await guardarBitacora([
      "Insertar nueva isla",
      user.token.data.datos.idempleado,
      2,
      insertIsla.insertId,
    ]);

    res.status(200).json({ success: true, response: insertIsla });
  } catch (err) {
    console.log(err);
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
