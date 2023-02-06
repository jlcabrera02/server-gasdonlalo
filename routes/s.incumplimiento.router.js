import router from "express-promise-router";
import incumplimiento from "../controllers/s.incumplimiento.controller";

const route = router();

route.get("/", incumplimiento.find);
route.get(
  "/incumplimientosByConcurso/:idConcurso",
  incumplimiento.findByConcurso
);
route.get(
  "/categorizar/:idCategorizacion/:iddepartamento?",
  incumplimiento.findIncumplimientosXcategorizacion
);
route.post("/categorizar", incumplimiento.categorizarSNC);
route.post("/", incumplimiento.insert);
route.put("/descategorizar", incumplimiento.descategorizarSNC);
route.put("/cantidad", incumplimiento.updateCantidadInc);
route.put("/:id", incumplimiento.update);
route.delete("/:id", incumplimiento.delete);

export default route;
