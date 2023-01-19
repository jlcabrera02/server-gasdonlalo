import router from "express-promise-router";
import montoFaltante from "../controllers/d.montoFaltante.controller";

const route = router();

route.get("/", montoFaltante.find);
route.get("/semanas/:year/:month", montoFaltante.findXSemana);
route.get("/total-mes/:year/:month", montoFaltante.findCantidadXMes);
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
