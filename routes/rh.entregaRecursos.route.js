import router from "express-promise-router";
import enre from "../controllers/rh.entregaRecurso.controller";

const route = router();

route.get("/", enre.findRecursos);
route.get("/:idEntregaRecurso", enre.findRecursosXId);
route.get("/detalleEmpleado/:idEmpleado", enre.findRecursosXEmpleado);
route.post("/registro", enre.insert);
route.put("/edit/:idRecurso", enre.update);
route.delete("/eliminar/:idRecurso", enre.delete);

export default route;
