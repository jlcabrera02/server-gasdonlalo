import router from "express-promise-router";
import { documentoPreliquidaciones, backupdb } from "../services/viewDirectory";

const route = router();

route.get("/preliquidaciones", documentoPreliquidaciones);
route.get("/backupdb", backupdb);

export default route;
