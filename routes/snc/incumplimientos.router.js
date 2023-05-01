import router from "express-promise-router";
import { buscarIncumplimientos } from "../../controllers/snc/incumplimientos.controller";
const route = router();

route.get("/incumplimientos", buscarIncumplimientos);

export default route;
