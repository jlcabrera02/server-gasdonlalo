import router from "express-promise-router";
import recoleccionEfectivo from "../controllers/d.recoleccionEfectivo.controller";

const route = router();

route.get("/general/:year/:month", recoleccionEfectivo.findEmpleadosXMonth);
route.get("/:year/:month", recoleccionEfectivo.findAllRegistersXMonth);
route.get(
  "/empleado/:year/:month/:id",
  recoleccionEfectivo.findAllRegistersXMonthXEmpleado
);
route.get("/:id", recoleccionEfectivo.findOne);
route.post("/", recoleccionEfectivo.insert);
route.put("/:id", recoleccionEfectivo.update);
route.delete("/:id", recoleccionEfectivo.delete);

export default route;
