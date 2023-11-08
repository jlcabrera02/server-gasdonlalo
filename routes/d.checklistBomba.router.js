import router from "express-promise-router";
import checklistBomba from "../controllers/d.checklistBomba.controller";

const route = router();

route.get(
  "/findCheck/:year/:month/:idEmpleado",
  checklistBomba.findChecklistXmes
);
route.get("/:year/:month", checklistBomba.find);
route.post("/", checklistBomba.insert);
route.get("/registro-checklist", checklistBomba.notificaciones);
route.post("/registro-checklist", checklistBomba.nuevoChecklist); //Registro de parte de los bomberos en la tablets
route.put("/mensajevisto", checklistBomba.notificarChecklistVisto); //Notificar que ya se vio el mensaje.
route.put("/:id", checklistBomba.update);
route.delete("/:id", checklistBomba.delete);

export default route;
