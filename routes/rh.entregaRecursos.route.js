import router from "express-promise-router";
import enre from "../controllers/rh.entregaRecurso.controller";

const route = router();

route.get("/", enre.findRecursos);
route.get("/:idEntregaRecurso", enre.findRecursosXId);
route.post("/registro", enre.insert);
route.delete("/eliminar/:idRecurso", enre.delete);

export default route;
