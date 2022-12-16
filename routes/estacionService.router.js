import router from "express-promise-router";
import estacionService from "../controllers/estacionService.controller";

const route = router();

route.get("/", estacionService.find);
route.get("/:id", estacionService.findOne);
route.post("/", estacionService.insert);
route.put("/:id", estacionService.update);
route.delete("/:id", estacionService.delete);

export default route;
