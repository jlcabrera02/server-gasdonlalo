import router from "express-promise-router";
import controlador from "../../controllers/pronosticos/pronosticos.controller";
const { obtenerPronosticosXcombustible, obtenerPronosticosXES, pruebas } =
  controlador;
const route = router();

route.get("/registrosXcombustible", obtenerPronosticosXcombustible);
route.get("/registrosXES", obtenerPronosticosXES);

route.post("/pruebas", pruebas);

export default route;
