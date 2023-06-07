import { Server } from "socket.io";

const io = new Server(4001, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("usuario conectado", socket.id);

  socket.on("actualizar", (folio) => {
    // console.log({ folio });
    socket.broadcast.emit("actualizar", folio);
  });

  socket.on("capturando", (datos) => {
    // console.log({ datos });
    socket.broadcast.emit("capturando", {
      [`liq${datos.idLiquidacion}`]: datos,
    });
  });
});

export default io;
