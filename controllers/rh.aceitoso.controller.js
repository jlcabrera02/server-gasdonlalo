import aceiM from "../models/rh.aceitoso.model";
import empM from "../models/empleado.model";
import salidaNCM from "../models/salidaNoConforme.model";
const controller = {};

/* controller.feaa = async (req, res) => {
  try {
    const cuerpo = [1, "2023-01-01", "2023-01-01"];
    let response = await aceiM.obtenerEmpleadosXRegistro(cuerpo);
    console.log(response);
  } catch (err) {
    console.log(err);
  }
}; */

controller.findVentasAXestacion = async (req, res) => {
  try {
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

controller.insertVentaAceite = async (req, res) => {
  try {
    const { idEmpleado, idEstacionServicio, litrosVendidos, fecha } = req.body;

    const cuerpo = {
      idempleado: Number(idEmpleado),
      idestacion_servicio: Number(idEstacionServicio),
      fecha: fecha,
      cantidad: litrosVendidos,
    };

    const response = await aceiM.insertVentaAceite(cuerpo);

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
