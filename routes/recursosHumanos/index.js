import router from "express-promise-router";
import nominas from "./nominas.routes";
import detallesEmp from "./detallesEmpleados.routes";
import Cmadrugador from "./Cmadrugador.routes";
const route = router();

route.use("/", nominas);
route.use("/", detallesEmp);
route.use("/madrugador", Cmadrugador);

export default route;
