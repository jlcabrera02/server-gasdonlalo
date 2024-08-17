import router from "express-promise-router";
import DirectorioController from "../controllers/DirectorioProveedores.controller";
const { CProveedores, CEvaluaciones } = DirectorioController;
const route = router();

route.get("/proveedores/evaluaciones/obtener", CEvaluaciones.getAll);
route.get("/proveedores/obtener", CProveedores.getAll);
route.post("/proveedores/evaluar", CProveedores.guardarEvaluacion);
route.post("/proveedores/nuevo", CProveedores.create);

export default route;
