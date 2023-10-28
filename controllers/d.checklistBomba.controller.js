import checklistBombaM from "../models/d.checklistBomba.model";
import model from "../models/index";
import empM from "../models/rh.empleado.model";
import { guardarBitacora } from "../models/auditorias";
import auth from "../models/auth.model";
import sncaM from "../models/s.acumular.model";
import sequelize from "../config/configdb";
import { Op } from "sequelize";
const { empleados, Turnos, Islas, ES, ChecklistRegistros, LlaveAcceso } = model;
const { verificar } = auth;

const controller = {};
const area = "Checklist Bomba";

controller.find = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 5);
    if (!user.success) throw user;
    const { year, month } = req.params;
    const dias = new Date(year, month, 0).getDate();
    const empleado = await empM.find(1);
    const almacenar = [];

    for (let i = 0; i < empleado.length; i++) {
      const { idempleado } = empleado[i];
      const almacenarXempleado = [];
      for (let j = 1; j <= dias; j++) {
        let fecha = `${year}-${month}-${j}`;
        let response = await checklistBombaM.find([idempleado, fecha]);
        if (response.length > 0) {
          response = response.map((el) => ({
            ...el,
            fecha,
          }));
        } else {
          response = [
            {
              idchecklist_bomba: null,
              idempleado,
              fecha,
              cumple: null,
            },
          ];
        }
        almacenarXempleado.push(response[0]);
      }
      almacenar.push({ empleado: empleado[i], fechas: almacenarXempleado });
    }

    // await guardarBitacora([
    //   `${area} Empleado`,
    //   user.token.data.datos.idempleado,
    //   1,
    //   null,
    // ]);

    res.status(200).json({ success: true, response: almacenar });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findChecklistXmes = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 5);
    if (!user.success) throw user;
    const { idEmpleado, year, month } = req.params;
    const fecha = `${year}-${month}-01`;

    const empleado = await empM.findOne(idEmpleado);

    const response = await checklistBombaM.findChecklistXmes([
      idEmpleado,
      fecha,
      fecha,
    ]);

    for (let i = 0; i < response.length; i++) {
      const saliente = await empM.findOne(response[i].idempleado_saliente);
      response[i].empSaliente = saliente[0];
    }

    // await guardarBitacora([area, user.token.data.datos.idempleado, 1, null]);

    res.status(200).json({
      success: true,
      response: {
        empleado: empleado[0],
        data: response,
      },
    });
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
    let user = verificar(req.headers.authorization, 5);
    if (!user.success) throw user;
    const {
      fecha,
      islaLimpia,
      aceitesCompletos,
      bomba,
      estacionServicio,
      idEmpleadoSaliente,
      empleadoEntrante,
      turno,
      fechac,
      empleadoSaliente,
      idEmpleado,
      incidentes,
    } = req.body;

    const cuerpo = {
      fecha,
      isla_limpia: islaLimpia ? islaLimpia : false,
      aceites_completos: aceitesCompletos ? aceitesCompletos : false,
      bomba: bomba ? bomba : false,
      turno: turno ? turno : false,
      estacion_servicio: estacionServicio ? estacionServicio : false,
      empleado_entrante: empleadoEntrante ? empleadoEntrante : false,
      fechac: fechac ? fechac : false,
      empleado_saliente: empleadoSaliente ? empleadoSaliente : false,
      idempleado_saliente: idEmpleadoSaliente,
      idempleado: Number(idEmpleado),
      incidentes: incidentes ? incidentes : null,
    };

    if (
      !cuerpo.isla_limpia ||
      !cuerpo.aceites_completos ||
      !cuerpo.bomba ||
      !cuerpo.turno ||
      !cuerpo.estacion_servicio ||
      !cuerpo.empleado_entrante ||
      !cuerpo.fechac ||
      !cuerpo.empleado_saliente
    ) {
      let data = Object.entries(cuerpo).slice(1, 9);
      let incumple = data.filter((el) => el[1] === false);
      let atexto = incumple.map((el) => el[0].replace("_", " ")).join(", ");
      await sncaM.insert([3, idEmpleado, fecha, `No cumple con ${atexto}`]);
    }

    let response = await checklistBombaM.insert(cuerpo);

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

controller.update = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 6);
    if (!user.success) throw user;
    const { id } = req.params;
    const viejo = await checklistBombaM.findOne(id);

    const {
      fecha,
      islaLimpia,
      aceitesCompletos,
      bomba,
      turno,
      idEmpleadoSaliente,
      empleadoEntrante,
      idEmpleado,
      fechac,
      empleadoSaliente,
      estacionServicio,
      incidentes,
    } = req.body;

    const cuerpo = {
      fecha: fecha ? fecha : viejo.fecha,
      isla_limpia: islaLimpia ? islaLimpia : false,
      aceites_completos: aceitesCompletos ? aceitesCompletos : false,
      bomba: bomba ? bomba : false,
      turno: turno ? turno : false,
      estacion_servicio: estacionServicio ? estacionServicio : false,
      empleado_entrante: empleadoEntrante ? empleadoEntrante : false,
      empleado_saliente: empleadoSaliente ? empleadoSaliente : false,
      fechac: fechac ? fechac : false,
      idempleado_saliente: idEmpleadoSaliente,
      idempleado: Number(idEmpleado),
      incidentes: incidentes ? incidentes : null,
    };

    const snca = await sncaM.validar([cuerpo.idempleado, 3, cuerpo.fecha]);

    //Elimina la snc pendiente si todo esta bien
    if (viejo.cumple === 0) {
      if (
        cuerpo.isla_limpia &&
        cuerpo.aceites_completos &&
        cuerpo.bomba &&
        cuerpo.turno &&
        cuerpo.estacion_servicio &&
        cuerpo.empleado_entrante &&
        cuerpo.empleado_saliente &&
        cuerpo.fechac
      ) {
        if (snca.length > 0) {
          await sncaM.delete(snca[0].idsncacumuladas);
        }
      }
    }

    if (viejo.cumple === 1) {
      if (
        !cuerpo.isla_limpia ||
        !cuerpo.aceites_completos ||
        !cuerpo.bomba ||
        !cuerpo.turno ||
        !cuerpo.estacion_servicio ||
        !cuerpo.empleado_entrante ||
        !cuerpo.empleado_saliente ||
        !cuerpo.fechac
      ) {
        let data = Object.entries(cuerpo).slice(1, 9);
        let incumple = data.filter((el) => el[1] === false);
        let atexto = incumple.map((el) => el[0].replace("_", " ")).join(", ");
        await sncaM.insert([3, idEmpleado, fecha, `No cumple con ${atexto}`]);
      }
    }

    const data = [cuerpo, id];
    let response = await checklistBombaM.update(data);
    await guardarBitacora([area, user.token.data.datos.idempleado, 3, id]);
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
    let user = verificar(req.headers.authorization, 7);
    if (!user.success) throw user;
    const { id } = req.params;
    const viejo = await checklistBombaM.findOne(id);
    const snca = await sncaM.validar([viejo.idempleado, 3, viejo.fecha]);
    if (snca.length > 0) {
      await sncaM.delete(snca[0].idsncacumuladas);
    }
    let response = await checklistBombaM.delete(id);
    await guardarBitacora([area, user.token.data.datos.idempleado, 4, id]);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

//Registros de CheckList
controller.nuevoChecklist = async (req, res) => {
  try {
    const {
      fecha,
      idIsla,
      idTurno,
      keyEmpleadoEntrante,
      keyEmpleadoSaliente,
      idEstacionServicio,
      evaluaciones,
    } = req.body;

    const { aceitesCompletos, funcionalidad, islaLimpia } = evaluaciones;

    const dataEmpleadoE = await LlaveAcceso.findOne({
      where: { key: keyEmpleadoEntrante },
    });
    const dataEmpleadoS = await LlaveAcceso.findOne({
      where: { key: keyEmpleadoSaliente },
    });

    if (!dataEmpleadoE || !dataEmpleadoS) {
      throw {
        success: false,
        code: 400,
        msg: "Error una de las llaves no está asignada correctamente",
      };
    }

    const guardarRegistro = await ChecklistRegistros.create({
      fecha,
      idisla: idIsla,
      idturno: idTurno,
      idempleado_entrante: dataEmpleadoE.dataValues.idempleado,
      idempleado_saliente: dataEmpleadoS.dataValues.idempleado,
      idestacion_servicio: idEstacionServicio,
      aceites_completos: aceitesCompletos,
      isla_limpia: islaLimpia,
      funcionalidad: funcionalidad,
    });

    res.status(200).json({ success: true, response: guardarRegistro });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

//Notificaciones de los checklist
controller.notificaciones = async (req, res) => {
  try {
    const {
      month,
      year,
      fechaI,
      fechaF,
      idTurno,
      idEstacionServicio,
      idIsla,
      idEmpleado,
    } = req.query;

    const querys = {};

    if (fechaI && fechaF) {
      querys.fecha = { [Op.between]: [fechaI, fechaF] };
    }

    if (idIsla) {
      querys.idisla = Number(idIsla);
    }

    if (idTurno) {
      querys.idturno = Number(idTurno);
    }

    if (idEstacionServicio) {
      querys.idestacion_servicio = Number(idEstacionServicio);
    }

    if (idEmpleado) {
      querys[Op.or] = [
        { idempleado_entrante: Number(idEmpleado) },
        { idempleado_saliente: Number(idEmpleado) },
      ];
    }

    if (year && month) {
      querys[Op.and] = [
        sequelize.where(sequelize.fn("MONTH", sequelize.col("fecha")), month),
        sequelize.where(sequelize.fn("year", sequelize.col("fecha")), year),
      ];
    }

    const response = await ChecklistRegistros.findAll({
      where: querys,
      include: [
        { model: ES },
        { model: empleados, as: "empleado_entrante" },
        { model: empleados, as: "empleado_saliente" },
        { model: Turnos },
        { model: Islas },
      ],
      order: [["idchecklist", "DESC"]],
    });
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
