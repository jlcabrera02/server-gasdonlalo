import router from "express-promise-router";
import complement from "../controllers/complementos.controller";

const route = router();

route.get("/findone", complement.findOneById);
export default route;
