import router from "express-promise-router";
import acei from "../controllers/rh.aceitoso.controller";

const route = router();

route.get(
  "/reporte/:year/:month/:idEstacionServicio",
  acei.findVentasAXestacion
);
route.get("/reporte/:year/:month", acei.findVentasA);
route.post("/registro", acei.insertVentaAceite);

export default route;
