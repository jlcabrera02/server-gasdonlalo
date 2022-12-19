import router from "express-promise-router";
import empleado from "../controllers/empleado.controller";

const route = router();

route.get("/", empleado.find);
route.get("/:id", empleado.findOne);
route.post("/", empleado.insert);
route.put("/:id", empleado.update);
route.put("/alta/:id", empleado.update);
route.delete("/baja/:id", empleado.delete);

export default route;
