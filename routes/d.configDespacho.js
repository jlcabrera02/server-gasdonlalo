import router from "express-promise-router";
import configDesp from "../controllers/despacho/configuraciones.controller";

const route = router();

route.get("/configuraciones", configDesp.getConfig);
route.put("/configuraciones/editar", configDesp.setConfig);

export default route;
