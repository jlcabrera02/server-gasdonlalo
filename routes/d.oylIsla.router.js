import router from "express-promise-router";
import oyl from "../controllers/d.oylIsla.controller";

const route = router();

route.get("/identificador/:identificador", oyl.findByIdentificador);
route.get("/:year/:month/:idEmpleado?", oyl.findEvaluacionXmensual);
route.get("/cumplimientos", oyl.findCumplimientos);
route.post("/", oyl.insert);
route.put("/", oyl.update);
route.delete("/identificador/:identificador", oyl.delete);

export default route;
