import router from "express-promise-router";
import estacionService from "../controllers/auth.controller";

const route = router();

route.post("/lo", estacionService.as);
route.post("/login", estacionService.login);
route.post("/register", estacionService.register);

export default route;
