import salidaNoCM from "../models/s.salidaNoConforme.model";
import empleadoM from "../models/rh.empleado.model";
import auth from "../models/auth.model";
import resErr from "../respuestas/error.respuestas";
const { errorMath } = resErr;
const { verificar } = auth;

const controller = {};

controller.findTotalSalidasXDiaXEmpleado = async (req, res) => {
  try {
    const { fecha, idEmpleado } = req.params;
    const cuerpo = [idEmpleado, fecha];
    const response = await salidaNoCM.findTotalSalidasXDiaXEmpleado(cuerpo);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findSalidasNoConformesXMes = async (req, res) => {
  try {
    const { year, month } = req.params;
    let fecha = `${year}-${month}-01`;
    const response = await salidaNoCM.findSalidasNoConformesXMes(fecha);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findSalidasNoConformesXMesPendientes = async (req, res) => {
  try {
    const { year, month } = req.params;
    let fecha = `${year}-${month}-01`;
    const response = await salidaNoCM.findSNCPendiente([fecha, fecha]);
    response.forEach((el) => {
      el.empleadoIncumple = {
        nombre: el.nombre,
        idempleado: el.idempleado,
        apellido_paterno: el.apellido_paterno,
        apellido_materno: el.apellido_materno,
      };
      el.empleadoAutoriza = {
        idempleado: el.idempleado_autoriza,
        nombre: el.nombrea,
        apellido_paterno: el.apellidopa,
        apellido_materno: el.apellidoma,
      };

      delete el.idempleado;
      delete el.idempleado_autoriza;
      delete el.nombre;
      delete el.apellido_paterno;
      delete el.apellido_materno;
      delete el.idempleado_autoriza;
      delete el.nombrea;
      delete el.apellidopa;
      delete el.apellidoma;
    });
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findSalidasNoConformesXMesXIddepartamento = async (req, res) => {
  try {
    const { year, month, iddepartamento } = req.params;
    let fecha = `${year}-${month}-01`;
    const response = await salidaNoCM.findSalidasNoConformesXMesXIddepartamento(
      fecha,
      iddepartamento
    );
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findSNCXIncumplimiento = async (req, res) => {
  try {
    const { year, month, iddepartamento } = req.params;
    let fecha = `${year}-${month}-01`;
    const empleados = await empleadoM.findEmpleadosXmesXiddepartamento(
      iddepartamento
    );

    const response = [];

    for (let i = 0; i < empleados.length; i++) {
      const { idempleado, nombre, apellido_materno, apellido_paterno } =
        empleados[i];
      const incumplimientos = await salidaNoCM.findSNCXIncumplimiento([
        idempleado,
        fecha,
        fecha,
      ]);

      const total = incumplimientos
        .map((el) => el.total)
        .reduce((a, b) => a + b, 0);
      response.push({
        empleado: `${nombre} ${apellido_paterno} ${apellido_materno}`,
        totalSNC: total,
        incumplimientos,
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

controller.findSalidasXInconformidadXMesXiddepartemento = async (req, res) => {
  try {
    const { year, month, iddepartamento } = req.params;
    let fecha = `${year}-${month}-01`;
    const response =
      await salidaNoCM.findSalidasXInconformidadXMesXiddepartemento([
        fecha,
        fecha,
        iddepartamento,
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

controller.findSalidasXSemana = async (req, res) => {
  try {
    const { year, month, idSalida } = req.params;
    const fecha = `${year}-${month}-01`;
    let diasDelMes = new Date(year, month, 0).getDate(); //Me obtiene el numero de dias del mes
    let numSemana = diasDelMes / 7 > 4 ? 5 : 4; //Me obtiene cuantas semanas tiene el mes
    let empleados = await empleadoM.findEmpleadosXmesXiddepartamento([
      1,
      fecha,
    ]);
    let acumulador = [];
    for (let i = 0; i < empleados.length; i++) {
      let semanas = [];
      let iterador = 1;
      for (let j = 0; j < numSemana; j++) {
        if (iterador + 6 > diasDelMes) {
          let firstFecha = `${year}-${month}-${iterador}`;
          let lasFecha = `${year}-${month}-${diasDelMes}`;
          let response = await salidaNoCM.findSalidasXSemanaXidEmpleado([
            empleados[i].idempleado,
            firstFecha,
            lasFecha,
          ]);
          semanas.push({
            semana: j + 1,
            diaEmpiezo: firstFecha,
            diaTermino: lasFecha,
            nombre_completo: empleados[i].nombre_completo,
            total: response.length > 0 ? response[0].total : 0,
          });
        } else {
          let firstFecha = `${year}-${month}-${iterador}`;
          let lasFecha = `${year}-${month}-${iterador + 6}`;
          let response = await salidaNoCM.findSalidasXSemanaXidEmpleado([
            empleados[i].idempleado,
            firstFecha,
            lasFecha,
          ]);
          semanas.push({
            semana: j + 1,
            diaEmpiezo: firstFecha,
            diaTermino: lasFecha,
            nombre_completo: empleados[i].nombre_completo,
            total: response.length > 0 ? response[0].total : 0,
          });
        }
        iterador = iterador + 7;
      }
      acumulador.push(semanas);
    }
    res.status(200).json({ success: true, response: acumulador });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findOne = async (req, res) => {
  try {
    const { idSalida } = req.params;
    const response = await salidaNoCM.findOne(idSalida);
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
  let user = verificar(req.headers.authorization, 20);
  if (!user.success) throw user;
  try {
    const {
      fecha,
      descripcionFalla,
      accionesCorregir,
      concesiones,
      idEmpleadoIncumple,
      idIncumplimiento,
    } = req.body;

    const cuerpo = {
      fecha,
      descripcion_falla: descripcionFalla,
      acciones_corregir: accionesCorregir,
      concesiones,
      idempleado: Number(idEmpleadoIncumple),
      idempleado_autoriza: Number(user.token.data.datos.idempleado),
      idincumplimiento: Number(idIncumplimiento),
    };

    let response = await salidaNoCM.insert(cuerpo);
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
  let user = verificar(req.headers.authorization, 20);
  if (!user.success) throw user;
  try {
    const { idSalidaNoConforme } = req.params;
    const {
      fecha,
      descripcionFalla,
      accionesCorregir,
      concesiones,
      idEmpleadoIncumple,
      idIncumplimiento,
      idDepartamento,
    } = req.body;

    // let departamento = await empleadoM.validarDepartamento(idEmpleadoIncumple);
    // if (departamento != idDepartamento)
    //   throw errorMath("El empleado no pertenece al departamento");

    const cuerpo = [
      {
        fecha,
        descripcion_falla: descripcionFalla,
        acciones_corregir: accionesCorregir,
        concesiones,
        idempleado: Number(idEmpleadoIncumple),
        idempleado_autoriza: Number(user.token.data.datos.idempleado),
        idincumplimiento: Number(idIncumplimiento),
      },
      Number(idSalidaNoConforme),
    ];

    let response = await salidaNoCM.update(cuerpo);
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
    const { idSalidaNoConforme } = req.params;
    let response = await salidaNoCM.delete(idSalidaNoConforme);
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
