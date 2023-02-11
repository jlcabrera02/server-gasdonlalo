import router from "express-promise-router";
import empleado from "../controllers/rh.empleado.controller";

const route = router();

route.get("/", empleado.find);
route.get("/:id", empleado.findOne);
route.post("/", empleado.insert);
route.put("/:idEmpleado", empleado.update);

export default route;
