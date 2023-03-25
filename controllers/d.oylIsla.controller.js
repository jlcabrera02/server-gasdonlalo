import oylM from "../models/d.oylIsla.model";
import generadorId from "../assets/generadorId";
import auth from "../models/auth.model";
import sncaM from "../models/s.acumular.model";
import empM from "../models/rh.empleado.model";
import formatTiempo from "../assets/formatTiempo";
const { tiempoDB } = formatTiempo;
const { verificar } = auth;

const controller = {};

controller.findEvaluacionXmensual = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 25);
    if (!user.success) throw user;
    const empleados = await empM.findEmpleadosXmesXiddepartamento(1);
    const { year, month, idEmpleado } = req.params;
    const fecha = `${year}-${month}-01`;
    let response = [];
    if (idEmpleado) {
      const data = await oylM.findEvaluacionXmensual([
        fecha,
        fecha,
        idEmpleado,
      ]);
      const puntos = data
        .map((el) => (el.cumple ? 1 : 0))
        .reduce((a, b) => a + b, 0);

      const empleado = await empM.findOne(idEmpleado);

      let agrupar = {};

      data.forEach((el) => {
        if (!agrupar.hasOwnProperty(el.identificador)) {
          agrupar[el.identificador] = [el];
        } else {
          agrupar[el.identificador].push(el);
        }
      });

      agrupar = Object.values(agrupar);

      response = {
        empleado: {
          ...empleado[0],
          evaluaciones: agrupar,
          totalPuntos: puntos,
        },
      };
    } else {
      for (let i = 0; i < empleados.length; i++) {
        const {
          idempleado,
          nombre,
          apellido_paterno,
          apellido_materno,
          idchecador,
        } = empleados[i];
        const cuerpo = [fecha, fecha, idempleado];
        const data = await oylM.findEvaluacionXmensual(cuerpo);
        let agrupar = {};
        const puntos = data
          .map((el) => (el.cumple ? 1 : 0))
          .reduce((a, b) => a + b, 0);

        data.forEach((el) => {
          if (!agrupar.hasOwnProperty(el.identificador)) {
            agrupar[el.identificador] = [el];
          } else {
            agrupar[el.identificador].push(el);
          }
        });

        agrupar = Object.values(agrupar);

        response.push({
          idempleado,
          idchecador,
          nombre,
          apellido_materno,
          apellido_paterno,
          evaluaciones: agrupar.length > 0 ? agrupar : null,
          totalPuntos: puntos,
        });
      }
    }
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findByIdentificador = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 25);
    if (!user.success) throw user;
    const { identificador } = req.params;
    let response = await oylM.findByIdentificador(identificador);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findCumplimientos = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    let response = await oylM.findCumplimientos();
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findHistorial = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 25);
    if (!user.success) throw user;
    const { idEmpleado } = req.params;
    const response = await oylM.findHistorial(idEmpleado);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.insert = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 25);
    if (!user.success) throw user;
    const {
      idEmpleado,
      idEstacionServicio,
      isla,
      fecha,
      idTurno,
      evaluaciones,
      incidentes,
    } = req.body;
    const idGenerico = generadorId();

    if (
      evaluaciones.length === 9 &&
      evaluaciones.some((el) => el.idcumplimiento === 5)
    )
      throw {
        code: 400,
        msg: "Datos incompletos procura rellenar bien los puntos del formulario.",
        success: false,
      };

    const cuerpo = evaluaciones.map((el) => [
      fecha,
      Number(isla),
      Number(idEstacionServicio),
      Number(idEmpleado),
      Number(el.idcumplimiento),
      idGenerico,
      Number(el.cumple),
      Number(idTurno),
      incidentes ? incidentes : null,
    ]);

    let buscarInconformidad = evaluaciones.some((el) => el.cumple === 0);

    if (buscarInconformidad || incidentes) {
      await sncaM.insert([
        13,
        idEmpleado,
        fecha,
        `Incidentes o falta de puntos en orden y limpieza`,
      ]);
    }

    const response = await oylM.insert(cuerpo);

    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res
        .status(400)
        .json({ success: false, msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.update = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 12);
    if (!user.success) throw user;
    const { idEmpleado, evaluaciones } = req.body;
    const getIdentificador = await oylM.findOne(evaluaciones[0].idoyl);
    const viejo = await oylM.findByIdentificador(
      getIdentificador.identificador
    );

    const viejoIncorrecto = viejo.some((el) => el.cumple === false);

    const fecha = tiempoDB(viejo[0].fecha);
    const snca = await sncaM.validar([idEmpleado, 7, fecha]);
    const cuerpo = evaluaciones.map((el) => [el.cumple, el.idoyl, idEmpleado]);
    const incorrecto = cuerpo.some((el) => el.cumple === 0);
    if (!viejoIncorrecto && incorrecto) {
      sncaM.insert([
        13,
        idEmpleado,
        fecha,
        `Incidentes o falta de puntos en orden y limpieza`,
      ]);
    }

    if (snca.length > 0 && incorrecto) {
      await sncaM.delete(snca[0].idsncacumuladas);
    }

    let response = await oylM.update(cuerpo);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.delete = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 13);
    if (!user.success) throw user;
    const { identificador } = req.params;

    const viejo = await oylM.findByIdentificador(identificador);

    const snca = await sncaM.validar([
      viejo[0].idempleado,
      1,
      tiempoDB(viejo[0].fecha),
    ]);

    if (snca.length > 0) await sncaM.delete(snca[0].idsncacumuladas);

    let response = await oylM.delete(identificador);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

export default controller;
