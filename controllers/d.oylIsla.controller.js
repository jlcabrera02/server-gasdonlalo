import oylM from "../models/d.oylIsla.model";
import generadorId from "../assets/generadorId";
import auth from "../models/auth.model";
import formatTiempo from "../assets/formatTiempo";
import sncaM from "../models/s.acumular.model";
import empM from "../models/rh.empleado.model";
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
        }

        agrupar[el.identificador].push(el);
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
          }

          agrupar[el.identificador].push(el);
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

controller.insert = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 25);
    if (!user.success) throw user;
    const { idEmpleado, idEstacionServicio, isla, fecha, evaluaciones } =
      req.body;
    const idGenerico = generadorId();
    const cumplimientos = await oylM.findCumplimientos();

    const insertCumplimientos = cumplimientos.map((el) => ({
      idcumplimiento: el.idoyl_cumplimiento,
      cumple: 0,
    }));

    evaluaciones.forEach((el) => {
      let indexRemplazar = insertCumplimientos.findIndex(
        (pa) => pa.idcumplimiento === Number(el.idcumplimiento)
      );

      insertCumplimientos[indexRemplazar] = el;
    });

    const cuerpo = insertCumplimientos.map((el) => [
      fecha,
      isla,
      idEstacionServicio,
      idEmpleado,
      el.idcumplimiento,
      idGenerico,
      el.cumple,
    ]);

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

    const cuerpo = evaluaciones.map((el) => [el.cumple, el.idoyl, idEmpleado]);

    let response = await oylM.update(cuerpo);
    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
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
