import router from "express-promise-router";
import {
  crearDetalles,
  buscarDetalles,
  editarDetalle,
  buscarDetallesXEmpleados,
  eliminarDetalle,
} from "../../controllers/recursosHumanos/detallesEmpleados.controller";
const route = router();

route.post("/detallesEmp/crear", crearDetalles);
route.delete("/detallesEmp/eliminar/:idEmpleado", eliminarDetalle);
route.put("/detallesEmp/edit/:idEmpleado", editarDetalle);
route.get("/detallesEmp/buscar", buscarDetalles);
route.get("/detallesEmp/buscarTodo", buscarDetallesXEmpleados);

export default route;
