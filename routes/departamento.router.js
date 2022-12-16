import router from "express-promise-router";
import departamento from "../controllers/departamento.controller";

const route = router();

route.get("/", departamento.find);
route.post("/", departamento.insert);
route.put("/:id", departamento.update);
route.delete("/:id", departamento.delete);

export default route;
