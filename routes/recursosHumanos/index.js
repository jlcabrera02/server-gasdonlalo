import router from "express-promise-router";
import nominas from "./nominas.routes";
const route = router();

route.use("/", nominas);

export default route;
