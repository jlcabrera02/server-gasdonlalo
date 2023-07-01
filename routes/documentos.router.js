import router from "express-promise-router";
import { documentoPreliquidaciones } from "../services/viewDirectory";

const route = router();

route.get("/preliquidaciones", documentoPreliquidaciones);

export default route;
