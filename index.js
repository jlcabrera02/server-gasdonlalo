import app from "./app";
import io from "./socket";
//Inicializo el servidor
app.listen(app.get("port"), () => {
  console.log(`Example app listening on port ${app.get("port")}`);
});
