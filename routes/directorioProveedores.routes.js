import router from "express-promise-router";
import DirectorioController from "../controllers/DirectorioProveedores.controller";
const { CProveedores, CEvaluaciones } = DirectorioController;
const route = router();

route.get("/proveedores/evaluaciones/obtener", CEvaluaciones.getAll);
route.get("/proveedores/obtener", CProveedores.getAll);
route.get("/proveedores/obtener/:id", CProveedores.getById);
route.post("/proveedores/evaluar", CProveedores.guardarEvaluacion);
route.post("/proveedores/nuevo", CProveedores.create);
route.put("/proveedores/editar/:id", CProveedores.update);

route.delete("/proveedores/evaluaciones/eliminar/:id", CEvaluaciones.delete);

export default route;
