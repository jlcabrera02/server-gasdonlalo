import router from "express-promise-router";
import incumplimientos from "./incumplimientos.router";
import snc from "./snc.router";
const route = router();

route.use("/incumplimientos", incumplimientos);
route.use("/snc", snc);

export default route;
