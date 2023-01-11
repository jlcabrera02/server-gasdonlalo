import montoFaltanteM from "../models/d.montoFaltante.model";
import empleadoM from "../models/rh.empleado.model";
import resErr from "../respuestas/error.respuestas";
import Decimal from "decimal.js-light";
const { errorMath } = resErr;

const controller = {};

controller.find = async (req, res) => {
  try {
    let response = await montoFaltanteM.find();
    console.log(response);
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
    console.log(err);
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findCantidadXMes = async (req, res) => {
  try {
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
    const { year, month, idEmpleado } = req.params;
    let idempleado = idEmpleado || null;
    let fecha = `${year}-${month}-01`;
    let response = await montoFaltanteM.findXMesXEmpleado(fecha, idempleado);
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
    const { id } = req.params;
    let response = await montoFaltanteM.findOne(id);
    console.log(response);
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

controller.insert = async (req, res) => {
  try {
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
    let response = await montoFaltanteM.insert(cuerpo);
    console.log(response);
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

controller.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad, fecha, empleado } = req.body;
    const cuerpo = {
      cantidad: Number(cantidad),
      fecha,
      idempleado: Number(empleado),
    };
    const data = [cuerpo, id];
    let response = await montoFaltanteM.update(data);
    console.log(response);
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
    const { id } = req.params;
    let response = await montoFaltanteM.delete(id);
    console.log(response);
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
