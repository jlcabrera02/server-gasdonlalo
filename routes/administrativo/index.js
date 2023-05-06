import router from "express-promise-router";
import turno from "./turno.routes";
const route = router();

route.use("/turnos", turno);

export default route;
