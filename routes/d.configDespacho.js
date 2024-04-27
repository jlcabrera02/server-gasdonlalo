import router from "express-promise-router";
import configDesp from "../controllers/despacho/configuraciones.controller";
import controller from "../controllers/despacho/configuraciones.controller";

const route = router();

route.get("/pm-configuraciones", controller.getPM);
route.post("/pm-configuraciones", controller.createPM);
route.delete("/pm-configuraciones/:id", controller.deletePM);

route.get("/configuraciones", configDesp.getConfig);
route.put("/configuraciones/editar", configDesp.setConfig);

export default route;
