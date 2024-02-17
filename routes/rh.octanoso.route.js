import router from "express-promise-router";
import oct from "../controllers/rh.octanoso.controller";

const route = router();

route.get("/:year/:month/", oct.find);
route.get(
  "/reporte/:year/:month/:idEstacionServicio",
  oct.findVentasLXestacion
);
route.get("/reporte/:year/:month", oct.findVentasL);
route.post("/octanoso", oct.octanosoC);
route.get("/octanoso-ambas", oct.octanosoAmbos);
route.post("/obtener", oct.findVentasLXestacionXIntervaloTiempo);
route.post("/registro", oct.insertVentaLitros);
route.put("/edit/:idOct", oct.updateLitros);
route.delete("/delete/:idOct", oct.delete);

export default route;
