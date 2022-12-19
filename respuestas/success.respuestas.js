const respuesta = {};

//Mensajes de success

respuesta.obtener = (res, data) => {
  res.status(201).json({
    success: true,
    code: 202,
    msg: "Se obtuvo correctamente la información",
    ...data,
  });
};

respuesta.insertar = (res, data) => {
  res.status(201).json({
    success: true,
    code: 201,
    msg: "Se creo el elemento satisfactoriamente",
    ...data,
  });
};

respuesta.actualizar = (res, data) => {
  res.status(200).json({
    success: true,
    code: 200,
    msg: "Se actualizo el elemento satisfactoriamente",
    ...data,
  });
};

respuesta.eliminar = (res, data) => {
  res.status(200).json({
    success: true,
    code: 200,
    msg: "Se elimino el elemento satisfactoriamente",
    ...data,
  });
};

export default respuesta;
