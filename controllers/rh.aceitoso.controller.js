import aceiM from "../models/rh.aceitoso.model";
import { guardarBitacora } from "../models/auditorias";
import empM from "../models/rh.empleado.model";
import salidaNCM from "../models/s.salidaNoConforme.model";
import formatTiempo from "../assets/formatTiempo";
import auth from "../models/auth.model";
const { verificar } = auth;

const controller = {};
const area = "Concurso Aceitoso";

controller.find = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { month, year } = req.params;
    const fecha = `${year}-${month}-01`;
    const response = await aceiM.find([fecha, fecha]);

    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findVentasAXestacion = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { year, month, idEstacionServicio } = req.params;
    const dias = new Date(year, month, 0).getDate();
    const fecha = `${year}-${month}-01`;
    const empleados = await aceiM.obtenerEmpleadosXRegistro([
      Number(idEstacionServicio),
      fecha,
      fecha,
    ]);
    const response = [];

    for (let i = 0; i < empleados.length; i++) {
      let dat = [];
      for (let j = 1; j <= dias; j++) {
        let fecha = `${year}-${month}-${j}`;
        let cuerpo = [
          empleados[i].idempleado,
          Number(idEstacionServicio),
          fecha,
        ];
        const data = await aceiM.findVentasAXestacion(cuerpo);
        const salida = await salidaNCM.findTotalSalidasXDiaXEmpleado([
          empleados[i].idempleado,
          fecha,
          3,
        ]);
        if (data.length > 0) {
          dat.push({ ...data[0], salidaNC: salida.total_salidas });
        } else {
          dat.push({
            idventa_aceite: null,
            fecha: new Date(fecha).toISOString(),
            idempleado: empleados[i].idempleado,
            idestacion_servicio: Number(idEstacionServicio),
            cantidad: 0,
            nombre: empleados[i].nombre,
            apellido_paterno: empleados[i].apellido_paterno,
            apellido_materno: empleados[i].apellido_materno,
            salidaNC: salida.total_salidas,
          });
        }
      }
      response.push({ empleado: empleados[i], datos: dat });
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

controller.findVentasA = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { year, month } = req.params;
    const dias = new Date(year, month, 0).getDate();
    const fecha = `${year}-${month}-01`;
    const empleados = await empM.findEmpleadosXmesXiddepartamento([1, fecha]);
    const response = [];

    for (let i = 0; i < empleados.length; i++) {
      let data = [];
      let idempleado = empleados[i].idempleado;
      for (let j = 1; j <= dias; j++) {
        let fecha = `${year}-${month}-${j}`;
        let cuerpo = [idempleado, fecha];
        const venta = await aceiM.findVentasA(cuerpo);
        const totalSalidas = await salidaNCM.findTotalSalidasXDiaXEmpleado([
          idempleado,
          fecha,
          3,
        ]);
        if (venta.length > 0) {
          data.push({ ...venta[0], salidaNC: totalSalidas.total_salidas });
        } else {
          data.push({
            idventa_aceite: null,
            fecha: new Date(fecha).toISOString(),
            idempleado: idempleado,
            idestacion_servicio: null,
            cantidad: 0,
            nombre: empleados[i].nombre,
            apellido_paterno: empleados[i].apellido_paterno,
            apellido_materno: empleados[i].apellido_materno,
            salidaNC: totalSalidas.total_salidas,
          });
        }
      }
      response.push({ empleados: empleados[i], data });
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

controller.findVentasAXestacionXIntervaloTiempo = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { fechaInicio, fechaFinal, idEstacionServicio } = req.body;
    const diaI = formatTiempo.tiempoLocal(fechaInicio).getDate();
    const milisegundos =
      new Date(fechaFinal).getTime() - new Date(fechaInicio).getTime();
    const dias = milisegundos / (1000 * 60 * 60 * 24);
    const empleados = await aceiM.obtenerEmpleadosXRegistroXintervalo([
      Number(idEstacionServicio),
      fechaInicio,
      fechaFinal,
    ]);
    const response = [];

    for (let i = 0; i < empleados.length; i++) {
      let dat = [];
      let descalificado = false;
      for (let j = diaI; j <= dias + diaI; j++) {
        let fecha = new Date(
          new Date(formatTiempo.tiempoLocal(fechaInicio)).setDate(j)
        )
          .toISOString()
          .split("T")[0];
        let cuerpo = [
          empleados[i].idempleado,
          Number(idEstacionServicio),
          fecha,
        ];
        const data = await aceiM.findVentasAXestacion(cuerpo);
        const salida = await salidaNCM.findTotalSalidasXDiaXEmpleado([
          empleados[i].idempleado,
          fecha,
          3,
        ]);
        if (data.length > 0) {
          dat.push({ ...data[0], salidaNC: salida.total_salidas });
          if (data[0].descalificado) descalificado = true;
        } else {
          dat.push({
            idventa_aceite: null,
            fecha: new Date(fecha).toISOString(),
            idempleado: empleados[i].idempleado,
            idestacion_servicio: Number(idEstacionServicio),
            cantidad: 0,
            nombre: empleados[i].nombre,
            apellido_paterno: empleados[i].apellido_paterno,
            apellido_materno: empleados[i].apellido_materno,
            salidaNC: salida.total_salidas,
            descalificado: false,
          });
        }
      }
      response.push({ descalificado, empleado: empleados[i], datos: dat });
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

controller.findVentasAXIntervaloTiempo = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { fechaInicio, fechaFinal } = req.query;
    const diaI = formatTiempo.tiempoLocal(fechaInicio).getDate();
    const milisegundos =
      new Date(fechaFinal).getTime() - new Date(fechaInicio).getTime();
    const dias = milisegundos / (1000 * 60 * 60 * 24);

    const empleados1 = await aceiM.obtenerEmpleadosXRegistroXintervalo([
      1,
      fechaInicio,
      fechaFinal,
    ]);
    const empleados2 = await aceiM.obtenerEmpleadosXRegistroXintervalo([
      2,
      fechaInicio,
      fechaFinal,
    ]);
    const estacion1 = [];
    const estacion2 = [];

    for (let i = 0; i < empleados1.length; i++) {
      let dat = [];
      let descalificado = false;
      for (let j = diaI; j <= dias + diaI; j++) {
        let fecha = new Date(
          new Date(formatTiempo.tiempoLocal(fechaInicio)).setDate(j)
        )
          .toISOString()
          .split("T")[0];
        let cuerpo = [empleados1[i].idempleado, 1, fecha];
        const data = await aceiM.findVentasAXestacion(cuerpo);
        const salida = await salidaNCM.findTotalSalidasXDiaXEmpleado([
          empleados1[i].idempleado,
          fecha,
          3,
        ]);
        if (data.length > 0) {
          dat.push({ ...data[0], salidaNC: salida.total_salidas });
          if (data[0].descalificado) descalificado = true;
        } else {
          dat.push({
            idventa_aceite: null,
            fecha: new Date(fecha).toISOString(),
            idempleado: empleados1[i].idempleado,
            idestacion_servicio: 1,
            cantidad: 0,
            nombre: empleados1[i].nombre,
            apellido_paterno: empleados1[i].apellido_paterno,
            apellido_materno: empleados1[i].apellido_materno,
            salidaNC: salida.total_salidas,
            descalificado: false,
          });
        }
      }
      estacion1.push({ descalificado, empleado: empleados1[i], datos: dat });
    }

    for (let i = 0; i < empleados2.length; i++) {
      let dat = [];
      let descalificado = false;
      for (let j = diaI; j <= dias + diaI; j++) {
        let fecha = new Date(
          new Date(formatTiempo.tiempoLocal(fechaInicio)).setDate(j)
        )
          .toISOString()
          .split("T")[0];
        let cuerpo = [empleados2[i].idempleado, 2, fecha];
        const data = await aceiM.findVentasAXestacion(cuerpo);
        const salida = await salidaNCM.findTotalSalidasXDiaXEmpleado([
          empleados2[i].idempleado,
          fecha,
          3,
        ]);
        if (data.length > 0) {
          dat.push({ ...data[0], salidaNC: salida.total_salidas });
          if (data[0].descalificado) descalificado = true;
        } else {
          dat.push({
            idventa_aceite: null,
            fecha: new Date(fecha).toISOString(),
            idempleado: empleados2[i].idempleado,
            idestacion_servicio: 2,
            cantidad: 0,
            nombre: empleados2[i].nombre,
            apellido_paterno: empleados2[i].apellido_paterno,
            apellido_materno: empleados2[i].apellido_materno,
            salidaNC: salida.total_salidas,
            descalificado: false,
          });
        }
      }
      estacion2.push({ descalificado, empleado: empleados2[i], datos: dat });
    }

    res.status(200).json({ success: true, estacion1, estacion2 });
  } catch (err) {
    console.log(err);
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.insertVentaAceite = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const {
      idEmpleado,
      idEstacionServicio,
      litrosVendidos,
      fecha,
      descalificado,
    } = req.body;

    const cuerpo = {
      idempleado: Number(idEmpleado),
      idestacion_servicio: Number(idEstacionServicio),
      fecha: fecha,
      cantidad: litrosVendidos,
      descalificado: Number(descalificado),
    };

    await aceiM.validarNoDuplicacado([cuerpo.fecha, cuerpo.idempleado]);

    const response = await aceiM.insertVentaAceite(cuerpo);

    await guardarBitacora([
      area,
      user.token.data.datos.idempleado,
      2,
      response.insertId,
    ]);

    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.updateVentaAceite = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { idAceite } = req.params;
    const {
      idEmpleado,
      idEstacionServicio,
      litrosVendidos,
      fecha,
      descalificado,
    } = req.body;

    const cuerpo = {
      idempleado: Number(idEmpleado),
      idestacion_servicio: Number(idEstacionServicio),
      fecha: fecha,
      cantidad: litrosVendidos,
      descalificado: Number(descalificado),
    };

    const response = await aceiM.updateVentaAceite(cuerpo, idAceite);

    await guardarBitacora([
      area,
      user.token.data.datos.idempleado,
      3,
      idAceite,
    ]);

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
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { idAceite } = req.params;

    const response = await aceiM.delete(idAceite);

    await guardarBitacora([
      area,
      user.token.data.datos.idempleado,
      4,
      idAceite,
    ]);

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
