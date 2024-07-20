import schudele from "node-schedule";
import models from "../models";
import moment from "moment";
import sequelize from "../config/configdb";
const { FechasActividades, OT, Actividades } = models;

//Funcion que agrega a solicitudes de trabajo las actividades asignadas en el calendario de programa de mantenimiento;
const job = schudele.scheduleJob(
  { minute: 0, hour: 8 /*Se activara todos los dias a las 8 de la manana*/ },
  async () => {
    try {
      const fecha = moment(new Date()).format("YYYY-MM-DD");

      const actividades = await FechasActividades.findAll({
        where: { id_ot: null, fecha_programada: fecha },
        include: [{ model: Actividades, as: "actividad", name: "actividades" }],
      });

      const actividadesObject = JSON.parse(JSON.stringify(actividades));

      if (actividadesObject.length < 1) return;

      for (const element of actividadesObject) {
        sequelize.transaction(async (t) => {
          const createOt = await OT.create(
            {
              idsolicitante: element.idsolicitante,
              tipo_mantenimiento: 2,
              idarea: element.idarea_trabajo,
              idestacion_servicio: element.idestacion_servicio,
              descripcion_falla: element.actividad.nombre,
            },
            { transaction: t }
          );

          const newIdOrden = createOt.dataValues.idorden_trabajo;

          await FechasActividades.update(
            { id_ot: newIdOrden },
            { where: { idfechas_actividades: element.idfechas_actividades } }
          );
        });
      }
      console.log(
        "Se agregaron correctamente las actividades a la solicitudes de ordenes de trabajo"
      );
    } catch (err) {
      console.log(err);
    }
  }
);

export default job;
