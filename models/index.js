import nominas, { tiposNominas } from "./recursosHumanos/nominas.model";
import empleados from "./recursosHumanos/empleados.model";
import departamentos from "./recursosHumanos/departamentos.model";
import detalleEmpleado from "./recursosHumanos/detalleEmpleado.model";

//SNC
import SNC from "./snc/snc.model";
import Incumplimientos from "./snc/incumplimientos";

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

export default {
  nominas,
  tiposNominas,
  empleados,
  departamentos,
  detalleEmpleado,
  SNC,
  Incumplimientos,
};
