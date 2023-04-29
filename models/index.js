import nominas, { tiposNominas } from "./recursosHumanos/nominas.model";
import empleados from "./recursosHumanos/empleados.model";
import departamentos from "./recursosHumanos/departamentos.model";
import detalleEmpleado from "./recursosHumanos/detalleEmpleado.model";

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

export default {
  nominas,
  tiposNominas,
  empleados,
  departamentos,
  detalleEmpleado,
};
