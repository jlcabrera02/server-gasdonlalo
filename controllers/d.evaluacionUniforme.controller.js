import evaluacionUniformeM from "../models/d.evaluacionUniforme.model";
import generadorId from "../assets/generadorId";
import empM from "../models/rh.empleado.model";
import auth from "../models/auth.model";
import formatTiempo from "../assets/formatTiempo";
import sncaM from "../models/s.acumular.model";
const { tiempoDB } = formatTiempo;
const { verificar } = auth;

const controller = {};

controller.findPasosEvUniforme = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 8);
    if (!user.success) throw user;
    let response = await evaluacionUniformeM.findPasosEvUniforme();
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findEvaluacionMensual = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 8);
    if (!user.success) throw user;
    const { year, month, idEmpleado } = req.params;
    const fecha = `${year}-${month}-01`;
    const cuerpo = [fecha, fecha];
    const cumplimientos = await evaluacionUniformeM.findPasosEvUniforme();
    let response = [];
    const getData = async (empleados, response, cuerpo, cumplimientos) => {
      const agrupar = {};
      const cantidad = [];
      const {
        nombre,
        apellido_paterno,
        apellido_materno,
        idempleado,
        idchecador,
      } = empleados;

      const data = await evaluacionUniformeM.findEvaluacionMensual(cuerpo);

      if (data.length > 0) {
        data.forEach((el) => {
          if (!agrupar.hasOwnProperty(el.identificador)) {
            agrupar[el.identificador] = [el];
          } else {
            agrupar[el.identificador].push(el);
          }
        });

        cumplimientos.forEach((el) => {
          const { cumplimiento, idcumplimiento_uniforme } = el;
          const cum = data.filter(
            (da) => da.idcumplimiento_uniforme === idcumplimiento_uniforme
          );

          const total = cum.length;

          const totalBuena = cum
            .map((el) => (el.cumple ? 1 : 0))
            .reduce((a, b) => a + b, 0);

          const totalMalas = total - totalBuena;
          cantidad.push({
            idcumplimiento_uniforme,
            cumplimiento,
            totalBuena,
            totalMalas,
            total,
          });
        });
      }

      let promedio = 0;
      const enlistar = Object.values(agrupar);

      if (cantidad.length > 0) {
        const total = cantidad.map((el) => el.total).reduce((a, b) => a + b);
        const totalBuenas = cantidad
          .map((el) => el.totalBuena)
          .reduce((a, b) => a + b);
        promedio = (totalBuenas * 10) / total;
      }

      response.push({
        idempleado,
        idchecador,
        nombre,
        apellido_paterno,
        apellido_materno,
        evaluaciones: enlistar,
        cantidad,
        promedio,
      });
    };

    if (!idEmpleado) {
      const empleados = await empM.findEmpleadosXmesXiddepartamento(1);

      for (let i = 0; i < empleados.length; i++) {
        let cuerpoNuevo = [...cuerpo, empleados[i].idempleado];
        await getData(empleados[i], response, cuerpoNuevo, cumplimientos);
      }
    } else {
      cuerpo.push(idEmpleado);
      const empleado = await empM.findOne(idEmpleado);
      await getData(empleado[0], response, cuerpo, cumplimientos);
    }

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

controller.findOne = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 8);
    if (!user.success) throw user;
    const { identificador } = req.params;
    const response = await evaluacionUniformeM.findOne(identificador);
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

controller.findXTiempo = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 8);
    if (!user.success) throw user;
    const { idEmpleado } = req.body;
    const cuerpo = [Number(idEmpleado)];
    const response = await evaluacionUniformeM.findXTiempo(cuerpo);
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

controller.insert = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 8);
    if (!user.success) throw user;
    const { empleado, fecha, evaluaciones } = req.body;
    const idGenerico = generadorId();
    const cuerpo = evaluaciones.map((el) => [
      fecha,
      Number(empleado),
      Number(el.idCumplimiento),
      2,
      Number(el.cumple),
      idGenerico,
    ]);

    const SNCvalidar = cuerpo.some((el) => el[4] === 0);
    if (SNCvalidar) {
      await sncaM.insert([
        11,
        empleado,
        fecha,
        `No cumplio completamente con el uniforme`,
      ]);
    }

    //await evaluacionUniformeM.validarNoDuplicadoXQuincena(req.body); //validamos si existe un registro

    let response = await evaluacionUniformeM.insert(cuerpo);
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
    let user = verificar(req.headers.authorization, 9);
    if (!user.success) throw user;
    const { empleado, evaluaciones } = req.body;

    const viejo = await evaluacionUniformeM.findByOne(
      evaluaciones[0].idEvaluacionUniforme
    );

    const viejoGroup = await evaluacionUniformeM.findOne(viejo.identificador);

    const cuerpo = evaluaciones.map((el) => [
      el.cumple,
      el.idEvaluacionUniforme,
      empleado,
    ]);

    const fecha = tiempoDB(viejo.fecha);

    const snca = await sncaM.validar([empleado, 11, fecha]);
    const correcto = viejoGroup.map((el) => el.cumple).includes(false);

    if (!correcto) {
      if (snca.length === 0) {
        await sncaM.insert([
          11,
          empleado,
          fecha,
          `No cumplio completamente con el uniforme`,
        ]);
      }
    } else {
      const SNCvalidar = cuerpo.map((el) => el[0]).includes(0);
      if (!SNCvalidar && snca.length > 0) {
        await sncaM.delete(snca[0].idsncacumuladas);
      }
    }
    let response = await evaluacionUniformeM.update(cuerpo);
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
    let user = verificar(req.headers.authorization, 10);
    if (!user.success) throw user;
    const { identificador } = req.params;
    const viejo = await evaluacionUniformeM.findOne(identificador);
    let cuerpo = [viejo[0].idempleado, 11, tiempoDB(viejo[0].fecha)];
    const validar = await sncaM.validar(cuerpo);
    if (validar.length > 0) {
      await sncaM.delete(validar[0].idsncacumuladas);
    }

    let response = await evaluacionUniformeM.delete(identificador);

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
