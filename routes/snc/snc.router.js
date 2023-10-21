import router from "express-promise-router";
import {
  buscarSNCXEmpleado,
  obtenerRegistros,
} from "../../controllers/snc/snc.controller";
const route = router();

route.get("/sncXEmpleado/:idEmpleado", buscarSNCXEmpleado);
route.get("/registros", obtenerRegistros);

export default route;
