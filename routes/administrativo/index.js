import router from "express-promise-router";
import turno from "./turno.routes";
import panicBtn from "./panicBtn.router";
const route = router();

route.use("/turnos", turno);
route.use("/panicBtn", panicBtn);

export default route;
