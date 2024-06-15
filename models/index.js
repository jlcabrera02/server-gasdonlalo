import nominas, { tiposNominas } from "./recursosHumanos/nominas.model";
import empleados from "./recursosHumanos/empleados.model";
import departamentos from "./recursosHumanos/departamentos.model";
import detalleEmpleado from "./recursosHumanos/detalleEmpleado.model";
import Cmadrugador from "./recursosHumanos/Cmadrugador.model.js";
import RM from "./recursosHumanos/Registrosmadrugador.model.js";

//Despacho
import ChecklistRegistros from "./despacho/ChecklistRegistros.model";
import RecursosDespachador, {
  RecursosDespachadorEv,
} from "./despacho/RecursoDespachador.model.js";

//SNC
import SNC from "./snc/snc.model";
import Incumplimientos from "./snc/incumplimientos";

//Administrativo
import Turnos from "./administrativo/turnos.model";
import ES from "./administrativo/estacionServicios.model";
import Gas from "./administrativo/liquidacion/gas.model";
import Islas from "./administrativo/liquidacion/islas.model";
import Mangueras from "./administrativo/liquidacion/mangueras.model";
import LecturasFinales from "./administrativo/liquidacion/lecturasFinales.model";
import InfoLecturas from "./administrativo/liquidacion/infoLecturas.model";
import Horarios from "./administrativo/liquidacion/horarios.model";
import Vales from "./administrativo/liquidacion/vales.model";
import Efectivo from "./administrativo/liquidacion/efectivo.model";
import Liquidaciones from "./administrativo/liquidacion/liquidaciones.model";
import LiquidacionesV2 from "./administrativo/liquidacion/liquidacionesV2.model";
import Precios from "./administrativo/liquidacion/precios.model";
import LlaveAcceso from "./administrativo/llavesAcceso.model";
import LlaveAccesoChecklist from "./administrativo/llavesAccesoChecklist.model.js";
import Auditoria from "./administrativo/auditoria.model";
import CodigosUso from "./administrativo/liquidacion/codigosUso.model";
import EfectivoTienda from "./administrativo/liquidacion/efectivoTienda.model";
import ControlVol from "./administrativo/liquidacion/control_volumetrico";
import Preliquidaciones from "./administrativo/liquidacion/preliquidaciones.model";
import PanicBtn from "./administrativo/panicBtn.model";
import SncNotification from "./snc/sncAcumuladas.model.js";
import PM from "./administrativo/PuntajesMinimos.js";

//pagares
import Pagares from "../models/pagares/Pagare.model";

//Mantenimiento
import OT from "./mantenimiento/OrdenesTrabajo.js";
import AT from "./mantenimiento/AreasTrabajo.js";
import TM from "./mantenimiento/TrabajosMantenimiento.js";
import OrdenTrabajo from "./mantenimiento/OrdenesTrabajo.js";
import {
  Actividades,
  FechasActividades,
} from "./mantenimiento/ProgramaMantenimiento.js";

//Pronostico
import Pronosticos from "./pronosticos/Pronostico.model.js";

nominas.belongsTo(empleados, { foreignKey: "idempleado" });
empleados.hasMany(nominas, { foreignKey: "idempleado" });

nominas.belongsTo(tiposNominas, { foreignKey: "idtipo_nomina" });
tiposNominas.hasMany(nominas, { foreignKey: "idtipo_nomina" });

empleados.belongsTo(departamentos, { foreignKey: "iddepartamento" });
departamentos.hasMany(empleados, { foreignKey: "iddepartamento" });

empleados.belongsTo(detalleEmpleado, { foreignKey: "idempleado" });
detalleEmpleado.belongsTo(empleados, { foreignKey: "idempleado" });
detalleEmpleado.belongsTo(tiposNominas, { foreignKey: "idtipo_nomina" });
tiposNominas.hasMany(detalleEmpleado, { foreignKey: "idtipo_nomina" });

departamentos.hasMany(Incumplimientos, { foreignKey: "iddepartamento" });
Incumplimientos.belongsTo(departamentos, { foreignKey: "iddepartamento" });

SNC.belongsTo(empleados, { foreignKey: "idempleado" });
empleados.hasMany(SNC, { foreignKey: "idempleado" });
SNC.belongsTo(empleados, {
  foreignKey: "idempleado_autoriza",
  as: "empleado_autoriza",
});
empleados.hasMany(SNC, { foreignKey: "idempleado" });

SNC.belongsTo(Incumplimientos, { foreignKey: "idincumplimiento" });
Incumplimientos.hasMany(SNC, { foreignKey: "idincumplimiento" });

InfoLecturas.belongsTo(Liquidaciones, { foreignKey: "idliquidacion" });
Liquidaciones.hasOne(InfoLecturas, { foreignKey: "idliquidacion" });

InfoLecturas.belongsTo(ES, { foreignKey: "idestacion_servicio" });
ES.hasMany(InfoLecturas, { foreignKey: "idestacion_servicio" });

Precios.belongsTo(Gas, { foreignKey: "idgas" });
Gas.hasMany(Precios, { foreignKey: "idgas" });

Precios.belongsTo(empleados, { foreignKey: "idempleado_captura" });
empleados.hasMany(Precios, { foreignKey: "idempleado_captura" });

Vales.belongsTo(Gas, { foreignKey: "combustible" });
Gas.hasMany(Vales, { foreignKey: "combustible" });

Vales.belongsTo(Liquidaciones, { foreignKey: "idliquidacion" });
Liquidaciones.hasMany(Vales, { foreignKey: "idliquidacion" });

Efectivo.belongsTo(Liquidaciones, { foreignKey: "idliquidacion" });
Liquidaciones.hasMany(Efectivo, { foreignKey: "idliquidacion" });

Liquidaciones.belongsTo(Horarios, { foreignKey: "idhorario" });
Horarios.hasMany(Liquidaciones, { foreignKey: "idhorario" });

Liquidaciones.belongsTo(empleados, {
  foreignKey: "idempleado_captura",
  as: "empleado_captura",
});
empleados.hasMany(Liquidaciones, {
  foreignKey: "idempleado_captura",
  as: "empleado_captura",
});

Horarios.belongsTo(empleados, { foreignKey: "idempleado" });
empleados.hasMany(Horarios, { foreignKey: "idempleado" });

Horarios.belongsTo(Turnos, { foreignKey: "idturno" });
Turnos.hasMany(Horarios, { foreignKey: "idturno" });

Horarios.belongsTo(ES, { foreignKey: "idestacion_servicio" });
ES.belongsTo(Horarios, {
  foreignKey: "idestacion_servicio",
});

Islas.belongsTo(ES, { foreignKey: "idestacion_servicio" });
ES.hasMany(Islas, {
  foreignKey: "idestacion_servicio",
});

empleados.hasOne(LlaveAcceso, { foreignKey: "idempleado" });
LlaveAcceso.belongsTo(empleados, { foreignKey: "idempleado" });

empleados.hasOne(LlaveAccesoChecklist, { foreignKey: "idempleado" });
LlaveAccesoChecklist.belongsTo(empleados, { foreignKey: "idempleado" });

CodigosUso.hasMany(EfectivoTienda, {
  foreignKey: "idcodigo_uso",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
EfectivoTienda.belongsTo(CodigosUso, {
  foreignKey: "idcodigo_uso",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

empleados.hasMany(EfectivoTienda, {
  foreignKey: "idempleado",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
EfectivoTienda.belongsTo(empleados, {
  foreignKey: "idempleado",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
ES.hasMany(EfectivoTienda, {
  foreignKey: "idestacion_servicio",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
EfectivoTienda.belongsTo(ES, {
  foreignKey: "idestacion_servicio",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

CodigosUso.hasMany(Efectivo, {
  foreignKey: "idcodigo_uso",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
Efectivo.belongsTo(CodigosUso, {
  foreignKey: "idcodigo_uso",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

CodigosUso.hasMany(Vales, {
  foreignKey: "idcodigo_uso",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
Vales.belongsTo(CodigosUso, {
  foreignKey: "idcodigo_uso",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

ControlVol.belongsTo(ES, { foreignKey: "idestacion_servicio" });
ES.hasMany(ControlVol, { foreignKey: "idestacion_servicio" });

empleados.hasMany(Pagares, { foreignKey: "idempleado" });
Pagares.belongsTo(empleados, { foreignKey: "idempleado" });

ChecklistRegistros.belongsTo(empleados, {
  foreignKey: "idempleado_entrante",
  as: "empleado_entrante",
});
ChecklistRegistros.belongsTo(empleados, {
  foreignKey: "idempleado_saliente",
  as: "empleado_saliente",
});
ChecklistRegistros.belongsTo(ES, { foreignKey: "idestacion_servicio" });
ChecklistRegistros.belongsTo(Turnos, { foreignKey: "idturno" });
ChecklistRegistros.belongsTo(Islas, { foreignKey: "idisla" });

PanicBtn.belongsTo(empleados, { foreignKey: "idempleado" });
PanicBtn.belongsTo(Islas, { foreignKey: "idisla" });

Preliquidaciones.belongsTo(empleados, { foreignKey: "idempleado" });
Preliquidaciones.belongsTo(Turnos, { foreignKey: "idturno" });
OT.belongsTo(AT, { foreignKey: "idarea" });
OT.belongsTo(ES, { foreignKey: "idestacion_servicio" });
OT.belongsTo(empleados, { foreignKey: "idpersonal", as: "personal" });
OT.belongsTo(empleados, { foreignKey: "idsolicitante", as: "solicitante" });
OT.belongsTo(empleados, { foreignKey: "idliberante", as: "liberante" });
AT.belongsTo(TM, { foreignKey: "idmantenimiento" });
TM.hasMany(AT, { foreignKey: "idmantenimiento" });
//mantenimiento programa
Actividades.hasMany(FechasActividades, { foreignKey: "idactividad" });
OT.belongsTo(FechasActividades, { foreignKey: "idorden_trabajo" });

RecursosDespachador.belongsToMany(empleados, {
  through: RecursosDespachadorEv,
  // uniqueKey: "idrecurso",
  foreignKey: "idrecurso",
  otherKey: "idempleado",
  as: "empleados",
});
empleados.belongsToMany(RecursosDespachador, {
  through: RecursosDespachadorEv,
  // uniqueKey: "idempleado",
  foreignKey: "idempleado",
  otherKey: "idrecurso",
  // as: "evaluaciones",
});

RecursosDespachador.hasMany(RecursosDespachadorEv, { foreignKey: "idrecurso" });
RecursosDespachadorEv.belongsTo(RecursosDespachador, {
  foreignKey: "idrecurso",
});
empleados.hasMany(RecursosDespachadorEv, {
  foreignKey: "idempleado",
  as: "evaluaciones",
});
RecursosDespachadorEv.belongsTo(empleados, { foreignKey: "idempleado" });

InfoLecturas.belongsToMany(Mangueras, {
  through: LecturasFinales,
  foreignKey: "idinfo_lectura",
});
Mangueras.belongsToMany(InfoLecturas, {
  through: LecturasFinales,
  foreignKey: "idmanguera",
});
InfoLecturas.hasMany(LecturasFinales, {
  foreignKey: "idinfo_lectura",
  as: "LCT",
});
LecturasFinales.belongsTo(InfoLecturas, { foreignKey: "idinfo_lectura" });
Mangueras.hasMany(LecturasFinales, { foreignKey: "idmanguera" });
LecturasFinales.belongsTo(Mangueras, { foreignKey: "idmanguera" });

SncNotification.belongsTo(empleados, { foreignKey: "idempleado" });
SncNotification.belongsTo(Incumplimientos, { foreignKey: "idincumplimiento" });

Cmadrugador.belongsTo(empleados, { foreignKey: "idempleado" });

OrdenTrabajo.belongsTo(empleados, {
  foreignKey: "idliberante",
  as: "empleado_autorizador",
});

// LiquidacionesV2 Relaciones

LiquidacionesV2.belongsTo(Horarios, { foreignKey: "idhorario" });

LiquidacionesV2.belongsTo(empleados, {
  foreignKey: "idempleado_captura",
  as: "empleado_captura",
});

Pronosticos.belongsTo(Gas, { foreignKey: "combustible", as: "gas" });
Pronosticos.belongsTo(ES, { foreignKey: "idestacion_servicio" });

export default {
  nominas,
  tiposNominas,
  empleados,
  departamentos,
  detalleEmpleado,
  SNC,
  Incumplimientos,
  Turnos,
  ES,
  LecturasFinales,
  InfoLecturas,
  Islas,
  Gas,
  Mangueras,
  Precios,
  Horarios,
  Efectivo,
  Vales,
  Liquidaciones,
  LiquidacionesV2,
  LlaveAcceso,
  LlaveAccesoChecklist,
  Auditoria,
  Pagares,
  CodigosUso,
  EfectivoTienda,
  ControlVol,
  Preliquidaciones,
  ChecklistRegistros,
  PanicBtn,
  OT,
  AT,
  TM,
  RecursosDespachadorEv,
  RecursosDespachador,
  SncNotification,
  Cmadrugador,
  RM,
  PM,
  Pronosticos,
  Actividades,
  FechasActividades,
};
