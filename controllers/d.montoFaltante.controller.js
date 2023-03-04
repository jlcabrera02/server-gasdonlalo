import montoFaltanteM from "../models/d.montoFaltante.model";
import empleadoM from "../models/rh.empleado.model";
import resErr from "../respuestas/error.respuestas";
import Decimal from "decimal.js-light";
import operacionTiempo from "../assets/operacionTiempo";
import formatTiempo from "../assets/formatTiempo";
import sncaM from "../models/s.acumular.model";
import auth from "../models/auth.model";
const { verificar } = auth;
const { errorMath, sinRegistro } = resErr;

const controller = {};

controller.find = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 2);
    if (!user.success) throw user;
    let response = await montoFaltanteM.find();
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findXSemana = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 2);
    if (!user.success) throw user;
    const { year, month } = req.params;
    let fecha = `${year}-${month}-01`;
    let diasDelMes = new Date(year, month, 0).getDate(); //Me obtiene el numero de dias del mes
    let numSemana = diasDelMes / 7 > 4 ? 5 : 4; //Me obtiene cuantas semanas tiene el mes
    let empleadosFind = await montoFaltanteM.findEmpleadosXmes(fecha);
    let acumulador = [];
    for (let j = 0; j < empleadosFind.length; j++) {
      let semanas = [];
      let iterador = 1;
      for (let i = 0; i < numSemana; i++) {
        if (iterador + 6 > diasDelMes) {
          let firstFecha = `${year}-${month}-${iterador}`;
          let lasFecha = `${year}-${month}-${diasDelMes}`;
          let response = await montoFaltanteM.findXSemana([
            empleadosFind[j].idempleado,
            firstFecha,
            lasFecha,
          ]);
          semanas.push({
            semana: i + 1,
            diaEmpiezo: firstFecha,
            diaTermino: lasFecha,
            cantidad: !response ? 0 : response[0].total,
          });
        } else {
          let firstFecha = `${year}-${month}-${iterador}`;
          let lasFecha = `${year}-${month}-${iterador + 6}`;
          let response = await montoFaltanteM.findXSemana([
            empleadosFind[j].idempleado,
            firstFecha,
            lasFecha,
          ]);
          semanas.push({
            semana: i + 1,
            diaEmpiezo: firstFecha,
            diaTermino: lasFecha,
            cantidad: !response ? 0 : response[0].total,
          });
        }
        iterador = iterador + 7;
      }
      acumulador.push({
        idempleado: empleadosFind[j].idempleado,
        nombre_completo: empleadosFind[j].nombre_completo,
        iddepartamento: empleadosFind[j].iddepartamento,
        semanas,
        total: semanas
          .map((el) => el.cantidad)
          .reduce(
            (a, b) => new Decimal(Number(a)).plus(Number(b)).toNumber(),
            0
          ),
      });
    }
    res.status(200).json({
      success: true,
      response: acumulador,
      totalSemanas: numSemana,
      montoTotalMes: acumulador
        .map((el) => el.total)
        .reduce((a, b) => new Decimal(Number(a)).plus(Number(b)).toNumber(), 0),
    });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findCantidadXMes = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 2);
    if (!user.success) throw user;
    const { year, month } = req.params;
    let fecha = `${year}-${month}-01`;
    let response = await montoFaltanteM.findCantidadXMes(fecha);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findXMesXEmpleado = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 2);
    if (!user.success) throw user;
    const { year, month, idEmpleado } = req.params;
    let idempleado = idEmpleado || null;
    let fecha = `${year}-${month}-01`;
    let response = await montoFaltanteM.findXMesXEmpleado(fecha, idempleado);
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
    let user = verificar(req.headers.authorization, 2);
    if (!user.success) throw user;
    const { idEmpleado, fechaInicio, fechaFinal } = req.body;
    const response = [];
    let dias = operacionTiempo.restarTiempo("days", fechaInicio, fechaFinal);

    let fi = formatTiempo.tiempoLocal(
      formatTiempo
        .tiempoLocal(fechaInicio)
        .setDate(formatTiempo.tiempoLocal(fechaInicio).getDate() - 1)
    );

    dias += 1;

    for (let i = 0; i < dias; i++) {
      fi.setDate(fi.getDate() + 1);
      let fecha = formatTiempo.tiempoDB(fi);
      let op = await montoFaltanteM.findXTiempo([fecha, idEmpleado]);
      if (op.length > 0) {
        response.push({ ...op[0], fecha: formatTiempo.tiempoDB(op[0].fecha) });
      } else {
        response.push({
          idmonto_faltante: null,
          idempleado: null,
          nombre_completo: null,
          iddepartamento: 1,
          nombre: null,
          apellido_paterno: null,
          apellido_materno: null,
          estatus: null,
          fecha: fecha,
          cantidad: 0,
        });
      }
    }
    const registros = response.filter((el) => el.nombre);
    if (registros.length <= 0) throw sinRegistro();
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
    let user = verificar(req.headers.authorization, 2);
    if (!user.success) throw user;
    const { cantidad, fecha, empleado } = req.body;
    const cuerpo = {
      cantidad: Number(cantidad),
      fecha,
      idempleado: Number(empleado),
    };
    let buscar = await empleadoM.findOne(empleado);
    if (buscar[0].iddepartamento != 1)
      throw errorMath(
        "El empleado no pertenece al departamento de despachadores"
      );

    await sncaM.insert([
      6,
      empleado,
      fecha,
      `Inconformidad por la cantidad de $${cantidad} pesos`,
    ]);
    let response = await montoFaltanteM.insert(cuerpo);
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
    let user = verificar(req.headers.authorization, 3);
    if (!user.success) throw user;
    const { id } = req.params;
    const { cantidad, fecha, empleado } = req.body;
    const snca = await sncaM.validar([empleado, 6, fecha]);
    await sncaM.update(
      {
        descripcion: `Inconformidad por la cantidad de $${cantidad} pesos`,
      },
      snca[0].idsncacumuladas
    );
    const cuerpo = {
      cantidad: Number(cantidad),
      fecha,
      idempleado: Number(empleado),
    };
    const data = [cuerpo, id];

    let response = await montoFaltanteM.update(data);
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
    let user = verificar(req.headers.authorization, 4);
    if (!user.success) throw user;
    const { id } = req.params;
    const viejo = await montoFaltanteM.findOne(id);
    const snca = await sncaM.validar([viejo.idempleado, 6, viejo.fecha]);
    await sncaM.delete(snca[0].idsncacumuladas);
    let response = await montoFaltanteM.delete(id);
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
