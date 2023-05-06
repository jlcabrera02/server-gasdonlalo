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
  editarTipoNomina,
  eliminarTipoNomina,
} from "../../controllers/recursosHumanos/nominas.controller";
const route = router();

route.get("/nomina/ultima", obtenerUltimoRegistro);
route.get("/nomina/buscar", obtenerNominas);
route.get("/nomina/buscar/:idNomina", obtenerNomina);
route.post("/nomina/guardar", guardarNomina);
route.put("/nomina/edit/:idNomina", actualizarNomina);
route.delete("/nomina/eliminar/:idNomina", eliminarNomina);
route.post("/nominaTipo/crear", guardarTipoNomina);
route.put("/nominaTipo/edit/:idTipo", editarTipoNomina);
route.delete("/nominaTipo/eliminar/:idTipo", eliminarTipoNomina);
route.get("/nominaTipo/buscar", obtenerTipoNomina);

export default route;
