import router from "express-promise-router";
import {
  actualizarNomina,
  eliminarNomina,
  guardarNomina,
  guardarTipoNomina,
  obtenerNomina,
  obtenerNominas,
  obtenerTipoNomina,
  obtenerUltimoRegistro,
} from "../../controllers//recursosHumanos/nominas.controller";
const route = router();

route.get("/nomina/ultima", obtenerUltimoRegistro);
route.get("/nomina/buscar", obtenerNominas);
route.get("/nomina/buscar/:idNomina", obtenerNomina);
route.post("/nomina/guardar", guardarNomina);
route.put("/nomina/edit/:idNomina", actualizarNomina);
route.delete("/nomina/eliminar/:idNomina", eliminarNomina);
route.post("/nominaTipo/crear", guardarTipoNomina);
route.get("/nominaTipo/buscar", obtenerTipoNomina);

export default route;
