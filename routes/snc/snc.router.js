import router from "express-promise-router";
import {
  buscarSNCXEmpleado,
  configSnc,
  obtenerRegistros,
  updateConfigSnc,
} from "../../controllers/snc/snc.controller";
const route = router();

route.get("/sncXEmpleado/:idEmpleado", buscarSNCXEmpleado);
route.get("/registros", obtenerRegistros);
route.get("/configuraciones", configSnc);
route.post("/configuraciones", updateConfigSnc);

export default route;
