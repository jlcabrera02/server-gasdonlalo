import router from "express-promise-router";
import rd from "../controllers/despacho/recursoDespachador.controller";

const route = router();

route.get("/obtener-evaluaciones", rd.getEv);
route.get("/obtener-recursos", rd.getRecursos);
route.post("/evaluacion", rd.createEv);

export default route;
