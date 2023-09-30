import router from "express-promise-router";
import salidaNoConforme from "../controllers/s.salidaNoConforme.controller";

const route = router();

route.get("/buscarxcoincidenciadatos", salidaNoConforme.buscarUnaSNCXDatos);
route.get("/pendientes/:idDepartamento?", salidaNoConforme.findSNCPorCapturar);
route.get("/detalleEmpleado/:idChecador", salidaNoConforme.findByEmpleado);

route.get(
  "/inconformidad/:year/:month/:iddepartamento",
  salidaNoConforme.findSalidasXInconformidadXMesXiddepartemento
);
route.get(
  "/pendientes/:year/:month",
  salidaNoConforme.findSalidasNoConformesXMesPendientes
);
route.get("/semanas/:year/:month", salidaNoConforme.findSalidasXSemana);
route.get("/:idSalida", salidaNoConforme.findOne);
route.get("/:year/:month", salidaNoConforme.findSalidasNoConformesXMes);
route.get(
  "/:year/:month/incumplimientoxiddepartamento/:iddepartamento",
  salidaNoConforme.findSNCXIncumplimiento
);
route.get(
  "/:year/:month/:iddepartamento",
  salidaNoConforme.findSalidasNoConformesXMesXIddepartamento
);

route.post("/", salidaNoConforme.insert);
route.put("/:idSalidaNoConforme", salidaNoConforme.update);
route.delete("/:idSalidaNoConforme", salidaNoConforme.delete);

export default route;
