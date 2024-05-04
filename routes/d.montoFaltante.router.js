import router from "express-promise-router";
import montoFaltante from "../controllers/d.montoFaltante.controller";
import { verificarToken } from "../middleware/token";

const route = router();

route.get("/semanas/:year/:month", verificarToken, montoFaltante.findXSemana);
route.get("/total-mes-empleado/:year/:month", montoFaltante.findXMesXEmpleado);
route.get(
  "/total-mes-empleado/:year/:month/:idEmpleado",
  montoFaltante.findXMesXEmpleado
);
route.post("/buscar", montoFaltante.findXTiempo);
route.post("/", montoFaltante.insert);
route.put("/:id", montoFaltante.update);
route.delete("/:id", montoFaltante.delete);

export default route;
