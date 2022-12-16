import router from "express-promise-router";
import incumplimiento from "../controllers/incumplimiento.controller";

const route = router();

route.get("/", incumplimiento.find);
route.get("/:id", incumplimiento.findOne);
route.post("/", incumplimiento.insert);
route.put("/:id", incumplimiento.update);
route.delete("/:id", incumplimiento.delete);

export default route;
