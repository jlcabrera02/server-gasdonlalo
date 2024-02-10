import router from "express-promise-router";
import {
  configuracion,
  obtenerConfiguracion,
  editarConfiguracion,
  guardarRegistros,
  eliminarConfiguracion,
  obtenerRegistros,
  eliminarRegistros,
} from "../../controllers/recursosHumanos/Cmadrugador.controller";
const route = router();

route.get("/registros", obtenerRegistros);
route.get("/configuracion-tabla", obtenerConfiguracion);

route.post("/configurar-tabla", configuracion);
route.post("/guardar-registros", guardarRegistros);

route.put("/configurar-tabla/:idconcurso", editarConfiguracion);
route.put("/eliminar-registros", eliminarRegistros);
route.delete("/eliminar-configuracion/:idconcurso", eliminarConfiguracion);

export default route;
