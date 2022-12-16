import router from "express-promise-router";
import montoFaltante from "../controllers/montoFaltante.controller";

const route = router();

route.get("/", montoFaltante.find);
route.get("/:id", montoFaltante.findOne);
route.post("/", montoFaltante.insert);
route.put("/:id", montoFaltante.update);
route.delete("/:id", montoFaltante.delete);

export default route;
