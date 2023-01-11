import router from "express-promise-router";
import checklistBomba from "../controllers/d.checklistBomba.controller";

const route = router();

route.get(
  "/findCheck/:idEmpleado/:fecha",
  checklistBomba.findXidempleadoXfecha
);
route.get("/:year/:month", checklistBomba.find);
route.get("/total/:year/:month", checklistBomba.totalChecks);
route.post("/", checklistBomba.insert);
route.put("/:id", checklistBomba.update);
route.delete("/:id", checklistBomba.delete);

export default route;
