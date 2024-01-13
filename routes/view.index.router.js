import router from "express-promise-router";
import view from "../controllers/view.index.controller";

const route = router();

route.get("/", view.index);
route.get("/boletas/all", view.boletasDespachadores);
route.get("/boletas", view.boletasDespachador);
route.get("/:idEmpleado", view.evaQnaJson);
route.get("/:idEmpleado/page/:page", view.empleado);

export default route;
