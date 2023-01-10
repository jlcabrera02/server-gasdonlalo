import router from "express-promise-router";
import oct from "../controllers/rh.octanoso.controller";

const route = router();

route.get(
  "/reporte/:year/:month/:idEstacionServicio",
  oct.findVentasLXestacion
);
route.get("/reporte/:year/:month", oct.findVentasL);
route.post("/registro", oct.insertVentaLitros);

export default route;
