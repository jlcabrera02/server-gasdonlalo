import checklistBombaM from "../models/d.checklistBomba.model";
import empM from "../models/rh.empleado.model";
import auth from "../models/auth.model";
import sncaM from "../models/s.acumular.model";
const { verificar } = auth;

const controller = {};

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
      idEmpleado,
    } = req.body;

    const cuerpo = {
      fecha,
      isla_limpia: islaLimpia ? islaLimpia : false,
      aceites_completos: aceitesCompletos ? aceitesCompletos : false,
      bomba: bomba ? bomba : false,
      turno: turno ? turno : false,
      estacion_servicio: estacionServicio ? estacionServicio : false,
      empleado_entrante: empleadoEntrante ? empleadoEntrante : false,
      idempleado_saliente: idEmpleadoSaliente,
      idempleado: Number(idEmpleado),
    };

    if (
      !cuerpo.isla_limpia ||
      !cuerpo.aceites_completos ||
      !cuerpo.bomba ||
      !cuerpo.turno ||
      !cuerpo.estacion_servicio ||
      !cuerpo.empleado_entrante
    ) {
      let data = Object.entries(cuerpo).slice(1, 7);
      let incumple = data.filter((el) => el[1] === false);
      let atexto = incumple.map((el) => el[0].replace("_", " ")).join(", ");
      await sncaM.insert([3, idEmpleado, fecha, `No cumple con ${atexto}`]);
    }

    let response = await checklistBombaM.insert(cuerpo);
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

      estacionServicio,
    } = req.body;

    const cuerpo = {
      fecha: fecha ? fecha : viejo.fecha,
      isla_limpia: islaLimpia ? islaLimpia : false,
      aceites_completos: aceitesCompletos ? aceitesCompletos : false,
      bomba: bomba ? bomba : false,
      turno: turno ? turno : false,
      estacion_servicio: estacionServicio ? estacionServicio : false,
      empleado_entrante: empleadoEntrante ? empleadoEntrante : false,
      idempleado_saliente: idEmpleadoSaliente,
      idempleado: Number(idEmpleado),
    };

    const snca = await sncaM.validar([cuerpo.idempleado, 3, cuerpo.fecha]);
    console.log(snca);

    //Elimina la snc pendiente si todo esta bien
    if (viejo.cumple === 0) {
      if (
        cuerpo.isla_limpia &&
        cuerpo.aceites_completos &&
        cuerpo.bomba &&
        cuerpo.turno &&
        cuerpo.estacion_servicio &&
        cuerpo.empleado_entrante
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
        cuerpo.empleado_entrante
      ) {
        let data = Object.entries(cuerpo).slice(1, 7);
        let incumple = data.filter((el) => el[1] === false);
        let atexto = incumple.map((el) => el[0].replace("_", " ")).join(", ");
        await sncaM.insert([3, idEmpleado, fecha, `No cumple con ${atexto}`]);
      }
    }

    const data = [cuerpo, id];
    let response = await checklistBombaM.update(data);
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
