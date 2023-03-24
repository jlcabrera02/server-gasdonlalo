import connection from "./connection";
//Este modelo me sirve para llevar un control de las peticiones
const model = {};

model.update = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "INSERT INTO auditorias (peticion, idempleado, accion, idaffectado) VALUES (?,?,?,?)";
    //[peticion, idempleado, accion, idaffectado]

    connection.query(sql, data, (err, res) => {
      if (res) return resolve(res);
    });
  });

export default model;
