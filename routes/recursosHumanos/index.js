import router from "express-promise-router";
import nominas from "./nominas.routes";
import detallesEmp from "./detallesEmpleados.routes";
const route = router();

route.use("/", nominas);
route.use("/", detallesEmp);

export default route;
