import router from "express-promise-router";
import {
  actualizarNomina,
  eliminarNomina,
  guardarNomina,
  guardarTipoNomina,
  obtenerNominas,
} from "../../controllers//recursosHumanos/nominas.controller";
const route = router();

route.get("/nomina/buscar", obtenerNominas);
route.post("/nomina/guardar", guardarNomina);
route.put("/nomina/edit/:idNomina", actualizarNomina);
route.delete("/nomina/eliminar/:idNomina", eliminarNomina);
route.post("/nominaTipo/crear", guardarTipoNomina);

export default route;
