import router from "express-promise-router";
import salidaNoConforme from "../controllers/salidaNoConforme.controller";

const route = router();

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
