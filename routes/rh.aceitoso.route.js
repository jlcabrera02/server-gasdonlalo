import router from "express-promise-router";
import acei from "../controllers/rh.aceitoso.controller";

const route = router();

route.get("/:year/:month/", acei.find);
route.get(
  "/reporte/:year/:month/:idEstacionServicio",
  acei.findVentasAXestacion
);
route.get("/reporte/:year/:month", acei.findVentasA);
route.post("/registro", acei.insertVentaAceite);
route.post("/obtener", acei.findVentasAXestacionXIntervaloTiempo);
route.delete("/:idAceite");

export default route;
