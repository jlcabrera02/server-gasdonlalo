import router from "express-promise-router";
import {
  configuracion,
  obtenerConfiguracion,
  editarConfiguracion,
  guardarRegistros,
  eliminarConfiguracion,
} from "../../controllers/recursosHumanos/Cmadrugador.controller";
const route = router();

route.get("/configuracion-tabla", obtenerConfiguracion);

route.post("/configurar-tabla", configuracion);
route.post("/guardar-registros", guardarRegistros);

route.put("/configurar-tabla/:idconcurso", editarConfiguracion);

export default route;
