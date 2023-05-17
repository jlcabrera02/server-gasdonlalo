import nominas, { tiposNominas } from "./recursosHumanos/nominas.model";
import empleados from "./recursosHumanos/empleados.model";
import departamentos from "./recursosHumanos/departamentos.model";
import detalleEmpleado from "./recursosHumanos/detalleEmpleado.model";

//SNC
import SNC from "./snc/snc.model";
import Incumplimientos from "./snc/incumplimientos";

//Administrativo
import Turnos from "./administrativo/turnos.model";
import Gas from "./administrativo/liquidacion/gas.model";
import Islas from "./administrativo/liquidacion/islas.model";
import Mangueras from "./administrativo/liquidacion/mangueras.model";
import LecturasFinales from "./administrativo/liquidacion/lecturasFinales.model";
import InfoLecturas from "./administrativo/liquidacion/infoLecturas.model";
import Horarios from "./administrativo/liquidacion/horarios.model";
import Vales from "./administrativo/liquidacion/vales.model";
import Efectivo from "./administrativo/liquidacion/efectivo.model";
import Liquidaciones from "./administrativo/liquidacion/liquidaciones.model";
import Precios from "./administrativo/liquidacion/precios.model";

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

// Incumplimientos.belongsTo(departamentos, { foreignKey: "iddepartamento" });
// departamentos.hasMany(Incumplimientos, { foreignKey: "iddepartamento" });

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
Liquidaciones.hasMany(InfoLecturas, { foreignKey: "idliquidacion" });

LecturasFinales.belongsTo(InfoLecturas, { foreignKey: "idinfo_lectura" });
InfoLecturas.hasOne(LecturasFinales, { foreignKey: "idinfo_lectura" });

LecturasFinales.belongsTo(Mangueras, { foreignKey: "idmanguera" });
Mangueras.hasMany(LecturasFinales, { foreignKey: "idmanguera" });

Precios.belongsTo(Gas, { foreignKey: "idgas" });
Gas.hasMany(Precios, { foreignKey: "idgas" });

Precios.belongsTo(empleados, { foreignKey: "idempleado_captura" });
empleados.hasMany(Precios, { foreignKey: "idempleado" });

Vales.belongsTo(Gas, { foreignKey: "combustible" });
Gas.hasMany(Vales, { foreignKey: "idgas" });

Vales.belongsTo(Liquidaciones, { foreignKey: "idliquidacion" });
Liquidaciones.hasMany(Vales, { foreignKey: "idliquidacion" });

Efectivo.belongsTo(Liquidaciones, { foreignKey: "idquidacion" });
Liquidaciones.hasMany(Efectivo, { foreignKey: "idliquidacion" });

Liquidaciones.belongsTo(Horarios, { foreignKey: "idhorario" });
Horarios.hasMany(Liquidaciones, { foreignKey: "idhorario" });

Horarios.belongsTo(empleados, { foreignKey: "idempleado" });
empleados.hasMany(Horarios, { foreignKey: "idempleado" });

Horarios.belongsTo(Turnos, { foreignKey: "idturno" });
Turnos.hasMany(Horarios, { foreignKey: "idturno" });

Islas.belongsToMany(Gas, { through: Mangueras, foreignKey: "idisla" });
Gas.belongsToMany(Islas, { through: Mangueras, foreignKey: "idgas" });

// Horarios.belongsTo(EstacionServicio, { foreignKey: "idestacion_servicio" });
// EstacionServicio.belongsTo(Horarios, {
//   foreignKey: "idestacion_servicio",
// });

export default {
  nominas,
  tiposNominas,
  empleados,
  departamentos,
  detalleEmpleado,
  SNC,
  Incumplimientos,
  Turnos,
  LecturasFinales,
  InfoLecturas,
  Mangueras,
  LecturasFinales,
  InfoLecturas,
  Islas,
  Gas,
};
