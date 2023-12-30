import router from "express-promise-router";
import {
  buscarSNCXEmpleado,
  obtenerRegistros,
  obtenerReportesEmpleados,
} from "../../controllers/snc/snc.controller";
const route = router();

route.get("/sncXEmpleado/:idEmpleado", buscarSNCXEmpleado);
route.get("/registros", obtenerRegistros);
route.get("/reportes-empleados", obtenerReportesEmpleados);
// route.get("/reportes-snc", obtenerReportes);

export default route;
