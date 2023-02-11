import octM from "../models/rh.octanoso.model";
import empM from "../models/rh.empleado.model";
import salidaNCM from "../models/s.salidaNoConforme.model";
import formatTiempo from "../assets/formatTiempo";
import auth from "../models/auth.model";
const { verificar } = auth;
const controller = {};

controller.findVentasLXestacion = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { year, month, idEstacionServicio } = req.params;
    const dias = new Date(year, month, 0).getDate();
    const fecha = `${year}-${month}-01`;
    const empleados = await octM.obtenerEmpleadosXRegistro([
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
        const data = await octM.findVentasLXestacion(cuerpo);
        const salida = await salidaNCM.findTotalSalidasXDiaXEmpleado([
          empleados[i].idempleado,
          fecha,
          2,
        ]);
        if (data.length > 0) {
          dat.push({ ...data[0], salidaNC: salida.total_salidas });
        } else {
          dat.push({
            idventa_litros: null,
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

controller.findVentasL = async (req, res) => {
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
        const venta = await octM.findVentasL(cuerpo);
        const totalSalidas = await salidaNCM.findTotalSalidasXDiaXEmpleado([
          idempleado,
          fecha,
          2,
        ]);
        if (venta.length > 0) {
          data.push({ ...venta[0], salidaNC: totalSalidas.total_salidas });
        } else {
          data.push({
            idventa_litros: null,
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

controller.findVentasLXestacionXIntervaloTiempo = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { fechaInicio, fechaFinal, idEstacionServicio } = req.body;
    const diaI = formatTiempo.tiempoLocal(fechaInicio).getDate();
    const milisegundos =
      new Date(fechaFinal).getTime() - new Date(fechaInicio).getTime();
    const dias = milisegundos / (1000 * 60 * 60 * 24);
    const empleados = await octM.obtenerEmpleadosXRegistroXintervalo([
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
        const data = await octM.findVentasLXestacion(cuerpo);
        const salida = await salidaNCM.findTotalSalidasXDiaXEmpleado([
          empleados[i].idempleado,
          fecha,
          2,
        ]);
        if (data.length > 0) {
          dat.push({ ...data[0], salidaNC: salida.total_salidas });
          if (data[0].descalificado) descalificado = true;
        } else {
          dat.push({
            idventa_litros: null,
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
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.insertVentaLitros = async (req, res) => {
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

    const response = await octM.insertVentaLitros(cuerpo);

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
