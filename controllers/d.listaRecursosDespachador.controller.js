import generadorId from "../assets/generadorId";
import listaReM from "../models/d.listaRecursosDespachador.model";
import resErr from "../respuestas/error.respuestas";
import empleado from "../models/rh.empleado.model";
import auth from "../models/auth.model";
import formatTiempo from "../assets/formatTiempo";
import sncaM from "../models/s.acumular.model";
const { tiempoDB } = formatTiempo;
const { verificar } = auth;
const { sinRegistro } = resErr;

const controller = {};

controller.findListRecursosXmes = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 17);
    if (!user.success) throw user;
    const { year, month } = req.params;
    let fecha = `${year}-${month}-01`;
    const response = await listaReM.findListRecursosXmes(fecha);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findListRecursosXmesXidEmpleado = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 17);
    if (!user.success) throw user;
    const { year, month, idEmpleado } = req.params;
    const fecha = `${year}-${month}-01`;
    const response = [];
    const quin1 = await listaReM.findListRecursosXmesXidEmpleadoXquincena([
      idEmpleado,
      1,
      fecha,
    ]);
    const quin2 = await listaReM.findListRecursosXmesXidEmpleadoXquincena([
      idEmpleado,
      2,
      fecha,
    ]);

    if (quin1.length > 0) {
      response.push({
        fecha: quin1[0].fecha,
        evaluaciones: quin1,
      });
    } else {
      response.push({
        fecha: null,
        evaluaciones: [],
      });
    }
    if (quin2.length > 0) {
      response.push({
        fecha: quin2[0].fecha,
        evaluaciones: quin2,
      });
    } else {
      response.push({
        fecha: null,
        evaluaciones: [],
      });
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

controller.findListRecursosXmesXidEmpleadoXquincena = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 17);
    if (!user.success) throw user;
    const { year, month, idEmpleado, quincena } = req.params;
    const fecha = `${year}-${month}-01`;
    const response = await listaReM.findListRecursosXmesXidEmpleadoXquincena([
      idEmpleado,
      quincena,
      fecha,
    ]);
    if (response.length < 1) throw sinRegistro();

    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findAllXQuicena = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 17);
    if (!user.success) throw user;
    const { year, month, quincena } = req.params;
    const fecha = `${year}-${month}-01`;
    const almacenar = [];

    const puntajeMinimo = await listaReM.findPuntajeMinimo(3);
    const empleados = await empleado.findEmpleadosXmesXiddepartamento([
      1,
      fecha,
    ]);

    for (let i = 0; i < empleados.length; i++) {
      const response = await listaReM.findAllXQuicena([
        fecha,
        fecha,
        empleados[i].idempleado,
        quincena,
      ]);
      almacenar.push({
        idempleado: empleados[i].idempleado,
        nombre_completo: empleados[i].nombre_completo,
        puntaje_minimo: puntajeMinimo.puntaje,
        recursos: response,
      });
    }
    res.status(200).json({ success: true, response: almacenar });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findRecursos = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 17);
    if (!user.success) throw user;
    const response = await listaReM.findRecursos();
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findXTiempo = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 17);
    if (!user.success) throw user;
    const { idEmpleado, fechaInicio, fechaFinal } = req.body;
    let cuerpo = [];
    if (fechaInicio || fechaFinal) {
      cuerpo = [Number(idEmpleado), fechaInicio, fechaFinal];
    } else {
      cuerpo = [Number(idEmpleado)];
    }
    const response = [];
    const evaluaciones = await listaReM.findXTiempoGroup(cuerpo);
    for (let i = 0; i < evaluaciones.length; i++) {
      const ev = await listaReM.findXid(evaluaciones[i].identificador);
      response.push(ev);
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
    let user = verificar(req.headers.authorization, 17);
    if (!user.success) throw user;
    const { identificador } = req.params;
    const response = await listaReM.findByIdentificador(identificador);
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
    let user = verificar(req.headers.authorization, 17);
    if (!user.success) throw user;
    const { empleado, fecha, recursos } = req.body;
    const idGenerico = generadorId();

    const recursosDB = await listaReM.findRecursos();
    let insertarRecursos = recursosDB.map((el) => ({
      idRecurso: el.idrecurso,
      evaluacion: 0,
    }));

    recursos.forEach((el) => {
      let indexRemplazar = insertarRecursos.findIndex(
        (re) => re.idRecurso === el.idRecurso
      );
      insertarRecursos[indexRemplazar] = el;
    });

    const cuerpo = insertarRecursos.map((el) => [
      fecha,
      Number(empleado),
      el.idRecurso,
      3,
      Number(el.evaluacion),
      idGenerico,
    ]);

    await listaReM.validarNoDuplicadoXQuincena({
      empleado,
      fecha,
    });

    const incorrecto = cuerpo.map((el) => el[4]).includes(0);
    if (incorrecto) {
      await sncaM.insert([7, empleado, fecha]);
    }

    let response = await listaReM.insert(cuerpo);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.update = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 18);
    if (!user.success) throw user;
    const { evaluaciones, idEmpleado } = req.body;

    const cuerpo = evaluaciones.map((el) => [
      Number(el.evaluacion),
      Number(el.idRecursoDespachador),
      Number(idEmpleado),
    ]);
    const viejo = await listaReM.findOne(cuerpo[0][1]);
    const fecha = tiempoDB(viejo[0].fecha);
    const snca = await sncaM.validar([idEmpleado, 7, fecha]);
    const viejoGroup = await listaReM.findByIdentificador(
      viejo[0].identificador
    );

    const incorrecto = cuerpo.map((el) => el[0]).includes(0);
    const viejoIncorrecto = viejoGroup
      .map((el) => el.evaluacion)
      .includes(false);

    if (!viejoIncorrecto && incorrecto) {
      await sncaM.insert([7, idEmpleado, fecha]);
    }

    if (snca.length > 0 && !incorrecto) {
      await sncaM.delete(snca[0].idsncacumuladas);
    }

    const response = await listaReM.update(cuerpo);
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
    let user = verificar(req.headers.authorization, 19);
    if (!user.success) throw user;
    const { identificador } = req.params;
    const viejo = await listaReM.findByIdentificador(identificador);
    const snca = await sncaM.validar([
      viejo[0].idempleado,
      7,
      tiempoDB(viejo[0].fecha),
    ]);
    if (snca.length > 0) {
      await sncaM.delete(snca[0].idsncacumuladas);
    }
    const response = await listaReM.delete(identificador);

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

export default controller;
