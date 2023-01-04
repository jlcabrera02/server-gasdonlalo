import router from "express-promise-router";
import salidaNoConforme from "../controllers/salidaNoConforme.controller";

const route = router();

route.get(
  "/inconformidad/:year/:month/:iddepartamento",
  salidaNoConforme.findSalidasXInconformidadXMesXiddepartemento
);
route.get("/semanas/:year/:month", salidaNoConforme.findSalidasXSemana);
route.get("/:idSalida", salidaNoConforme.findOne);
route.get("/:year/:month", salidaNoConforme.findSalidasNoConformesXMes);
route.get(
  "/:year/:month/:iddepartamento",
  salidaNoConforme.findSalidasNoConformesXMesXIddepartamento
);
// route.get("/:id", salidaNoConforme.findOne);
route.post("/", salidaNoConforme.insert);
route.put("/:idSalidaNoConforme", salidaNoConforme.update);
route.delete("/:idSalidaNoConforme", salidaNoConforme.delete);

export default route;
