import router from "express-promise-router";
import madrugador from "../controllers/rh.madrugador.controller";

const route = router();

route.get(
  "/control-mensual/:iddepartamento/:year/:month/",
  madrugador.findControlMadrugadorMG
);
route.get(
  "/control-diario/:year/:month/:day/:idEmpleado",
  madrugador.findControlMadrugadorD
);
route.get(
  "/control-mensual/:year/:month/:idEmpleado",
  madrugador.findControlMadrugadorM
);

export default route;
