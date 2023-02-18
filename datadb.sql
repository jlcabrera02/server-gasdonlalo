INSERT INTO departamento VALUES
(1, "Despacho"),
(2, "Administrativo"),
(3, "Calidad"),
(4, "Servicios Complementarios"),
(5, "Mantenimiento"),
(6, "Seguridad"),
(7, "Almacen"),
(8, "Recursos Humanos"),
(9, "Base Datos");

INSERT INTO incumplimiento VALUES 
(1, "INCUMPLIMIENTO REGLAS AREAS DEL DESPACHO"),
(2, "RETARDOS"),
(3, "CHECKLIST ERRONEO"),
(4, "RELOJ CHECADOR"),
(5, "HOJAS DE LIQUIDACION"),
(6, "MONTOS FALTANTES"),
(7, "FALTA RECURSOS"),
(8, "FALTAS"),
(9, "RECOLECCION DE EFECTIVO"),
(10, "VENTA Y COBRO DE COMBUSTIBLE"),
(11, "UNIFORME DE DESPACHO"),
(12, "ACEITES");
INSERT INTO empleado (idempleado, idchecador, nombre, apellido_paterno, apellido_materno, iddepartamento, estatus, edad, fecha_registro, update_time) VALUES 
(50, 50,"SERGIO RICARDO", "ALCOCER", "ALCOCER", 2, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(51, 51,"RODOLFO RAUL", "ALTUNAR", "HERNANDEZ", 3, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP);


INSERT INTO estacion_servicio VALUES 
(1, "GDL 1", 17.758961, -91.157478, null),
(2, "GDL 2", 17.758961, -91.157478, null);

INSERT INTO bomba VALUES 
(null, 1, "Bomba1", 1),
(null, 2, "Bomba2", 1),
(null, 3, "Bomba3", 1),
(null, 1, "Bomba1", 2),
(null, 2, "Bomba2", 2),
(null, 3, "Bomba3", 2);

INSERT INTO turno VALUES 
(1, "Mañana", "06:00:00", "14:00:00", "05:45:00"),
(2, "Tarde", "14:00:00", "22:00:00", "13:45:00"),
(3, "Noche", "22:00:00", "06:00:00", "21:45:00");

INSERT INTO turno_estacion VALUES (1, 1), (1, 2), (1, 3),(2, 1),(2,2);

INSERT INTO cumplimiento_uniforme VALUES 
(1,'Gorra en buen estado'),
(2,'Camisa fajada'),
(3,'Cinturón negro'),
(4,'Botas negras, boleadas color negro'),
(5,'Reflejantes en el pantalón'),
(6,'El gafete debe portarse todo el tiempo'),
(7,'El gafete cuenta con correa o broche');

INSERT INTO paso_despachar VALUES
(1,'Jalar y saludar'),
(2,'Que combustible desea'),
(3,'Cuanto combustible requiere'),
(4,'Su Forma de pago'),
(5,'Pantalla en ceros'),
(6,'Ofrecer lubricante'),
(7,'Colocar tapon'),
(8,'Cobrar y preguntar si quiere ticket'),
(9,'Agradecer al cliente');

INSERT INTO puntaje_minimo VALUES
(1,'checklist_bomba',24),
(2,'evaluacion_uniforme',7),
(3,'recurso_despachador',18),
(4,'concurso_madrugador', 240);

INSERT INTO recurso VALUES
(1,'Libreta'),
(2,'Pluma'),
(3,'Engrapadora'),
(4,'Tabla portapapeles'),
(5,'Plumon detector'),
(6,'Caja de metal'),
(7,'Calculadora'),
(8,'Sobre de plastico'),
(9,'Hoja liquidacion'),
(10,'Sobres de recoleccion'),
(11,'Gafete'),
(12,'Limpia parabrisas'),
(13,'Bolsa de cincho'),
(14,'Franela'),
(15,'Jabon'),
(16,'Juego de uniforme'),
(17,'impermeable'),
(18,'Par de botas'),
(19,'Desodorante'),
(20,'Candado');

INSERT INTO mantenimiento VALUES 
(1, "Reparaciones"),
(2, "Limpieza"),
(3, "Pintura");

INSERT INTO area VALUES 
(1, "Área despacho", 1),
(2, "Área descarga", 1),
(3, "Cuarto Eléctrico/Maquina",1),
(4, "Baños publicos", 1),
(5, "Estacionamiento", 1),
(6, "Oficinas", 1),
(7, "Otros", 1),
(8, "Área despacho", 2),
(9, "Área descarga", 2),
(10, "Cuarto Eléctrico/Maquina",2),
(11, "Baños publicos", 2),
(12, "Estacionamiento", 2),
(13, "Oficinas", 2),
(14, "Otros", 2),
(15, "Área despacho", 3),
(16, "Área descarga", 3),
(17, "Cuarto Eléctrico/Maquina",3),
(18, "Baños publicos", 3),
(19, "Estacionamiento", 3),
(20, "Oficinas", 3),
(21, "Otros", 3);

INSERT INTO documento VALUES 
(1, "SOLICITUD DE EMPLEO"),
(2, "ACTA DE NACIMIENTO"),
(3, "IDENTIFICACION OFICIAL"),
(4, "COMPROBANTE DE DOMICILIO"),
(5, "2-FOTOGRAFIAS TAMAÑO INFANTIL"),
(6, "COMPROBANTE DE ULTIMO GRADO DE ESTUDIO"),
(7, "CARTA DE RECOMENDACIÓN"),
(8, "SEGURO SOCIAL"),
(9, "R.F.C"),
(10, "CURP"),
(11, "TARJETA BANCARIA");

INSERT INTO tipo_falta VALUES
(1, "Todo en orden", "El empleado establecio su entrada correctamente", 0, "RGBA(56,255,136,1)"),
(2, "Falta justificable", "El empleado tiene justificada su falta", 0, "RGBA(0,157,19,1)"),
(3, "Dia de descanso", "El empleado descanso", 0, "RGBA(213,86,12,1)"),
(4, "Falta", "El empleado falto ese dia", 1, "RGBA(253,234,0,1)"),
(5, "Retardo", "El empleado llego despues de su hora de entrada", 1, "RGBA(253,234,0,1)"),
(6, "Capacitacion", "El empleado estuvo en capacitación", 0, "RGBA(0,209,141,1)"),
(7, "No checo entrada", "El empleado por algun motivo no capturo la entrada pero si trabajo", 1, "RGBA(209,0,39,1)");

INSERT INTO concurso (idconcurso, concurso, iddepartamento) VALUES 
(1,1, 1),
(2, 2, 1),
(3, 3, 1);

INSERT INTO user VALUES 
("sralcocer", "sralcocer@donlalo.com.mx", MD5("alcocer2023"), CURRENT_TIME, 50);

INSERT INTO area_trabajo VALUES 
(1, "Super usuario"),
(2, "Despacho"),
(3, "Salidas no conformes"),
(4, "Mantenimiento"),
(5, "Almacen"),
(6, "Calidad"),
(7, "Recursos Humanos"),
(8, "Administrativos"),
(9, "Seguridad"),
(10, "Documentos SGG");

INSERT INTO permiso (idpermiso, permiso, peticion, idarea_trabajo, descripcion) VALUES 
(1, "Universal", "Universal", 1, "Permiso para el superusuario"),
( 2, "Obtener y capturar datos", "Monto Faltante", 2, "Das permiso de que el usuario pueda ver y capturar datos"),
(3, "Actualizar", "Monto Faltante", 2, "Das permiso de que el usuario pueda actualizar"),
(4, "Eliminar", "Monto Faltante", 2, "Das permiso de que el usuario pueda eliminar"),
(5, "Obtener y capturar datos", "Checklist Bomba", 2, "Das permiso de que el usuario pueda ver y capturar datos"),
(6, "Actualizar", "Checklist Bomba", 2, "Das permiso de que el usuario pueda actualizar"),
(7, "Eliminar", "Checklist Bomba", 2, "Das permiso de que el usuario pueda eliminar"),
(8, "Obtener y capturar datos", "Evaluación Uniforme", 2, "Das permiso de que el usuario pueda ver y capturar datos"),
(9, "Actualizar", "Evaluación Uniforme", 2, "Das permiso de que el usuario pueda actualizar"),
(10, "Eliminar", "Evaluación Uniforme", 2, "Das permiso de que el usuario pueda eliminar"),
(11, "Administrar Incumplimientos", "Salidas No Conformes", 3, "Das permiso de que el usuario pueda manipular los incumplimientos para las salidas no conformes"),
(14, "Obtener y capturar datos", "Pasos Para Despachar", 2, "Das permiso de que el usuario pueda ver y capturar datos"),
(15, "Actualizar", "Pasos Para Despachar", 2, "Das permiso de que el usuario pueda actualizar"),
(16, "Eliminar", "Pasos Para Despachar", 2, "Das permiso de que el usuario pueda eliminar"),
(17, "Obtener y capturar datos", "Recursos Despachador", 2, "Das permiso de que el usuario pueda ver y capturar datos"),
(18, "Actualizar", "Recursos Despachador", 2, "Das permiso de que el usuario pueda actualizar"),
(19, "Eliminar", "Recursos Despachador", 2, "Das permiso de que el usuario pueda eliminar"),
(20, "Obtener y capturar datos", "Salidas No Conformes", 3, "Das permiso de que el usuario pueda ver y capturar datos"),
(21, "Actualizar", "Salidas No Conformes", 3, "Das permiso de que el usuario pueda actualizar"),
(22, "Eliminar", "Salidas No Conformes", 3, "Das permiso de que el usuario pueda eliminar"),
(23, "Autorizar", "Salidas No Conformes", 3, "Das permiso de que el usuario pueda dar una solución a las salidas no conformes"),
(24, "Administrar", "Recursos Humanos", 7, "Das permiso de que el usuario pueda administrar el área de recursos humanos"),
(48, "Visualizar usuarios", "Permisos", 8, "Das permiso de que el usuario pueda ver enlistada a los empleados y usuarios"),
(49, "Establecer usuario", "Permisos", 8, "Das permiso de que el usuario pueda crear un usuario a un empleado"),
(50, "Establecer permisos", "Permisos", 8, "Das permiso de que el usuario establecer permisos a los demas usuarios");

INSERT INTO acceso (user, idpermiso) VALUES 
("sralcocer", 1);