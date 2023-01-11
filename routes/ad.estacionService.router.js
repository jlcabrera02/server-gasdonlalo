import router from "express-promise-router";
import estacionService from "../controllers/ad.estacionService.controller";

const route = router();

route.get("/", estacionService.find);
route.get("/turnos", estacionService.findAllTurnos);
route.get("/turnos/:idEstacion", estacionService.findTurnos);
route.post("/", estacionService.insert);
route.put("/:id", estacionService.update);
route.delete("/:id", estacionService.delete);

export default route;
