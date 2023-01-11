import router from "express-promise-router";
import incumplimiento from "../controllers/s.incumplimiento.controller";

const route = router();

route.get("/", incumplimiento.find);
route.get("/:idDepartamento", incumplimiento.findXIdepartamento);
route.post("/", incumplimiento.insert);
route.put("/:id", incumplimiento.update);
route.delete("/:id", incumplimiento.delete);

export default route;
