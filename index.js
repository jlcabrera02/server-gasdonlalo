import app from "./app";
import server from "./socket/";

//Inicializo el servidores

server.listen(app.get("port-socket"), () => {
  console.log(
    "Servidor socket escuchando en el puerto " + app.get("port-socket")
  );
});

app.listen(app.get("port"), () => {
  console.log(`Servidor HTTP escuchando en el puerto ${app.get("port")}`);
});
