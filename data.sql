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

/* INSERT INTO empleado (idempleado, nombre, apellido_paterno, apellido_materno, iddepartamento) VALUES
(1,"JOSE MANUEL", "ECHAVARRIA", "LANDERO", 1),
(2,"ANDRES", "LANDERO", "JIMENEZ", 1), 
(3,"JESUS MANUEL", "ALEGRIA", "JIMENEZ", 1), 
(4,"JESUS ALEJANDRO", "GALLEGOS", "BAUTISTA", 1),
(5,"JOSE", "GUZMAN", "LOPEZ", 1), 
(6,"DAVID JOSUE", "TORRES", "PACHECO", 1),
(8,"JAIRO", "LOYDE", "HERNANDEZ", 1),
(9,"REY NERIO TRINIDAD", "EHUAN", "LOPEZ", 1),
(10,"DAVID", "ALONSO", "CENTENO", 1),
(11,"LUIS JAVIER", "JIMENEZ", "HERNANDEZ", 1),
(12,"JUAN", "LIZCANO", "DIAZ", 1),
(13,"WALTER DAVID", "GUTIERREZ", "MANDUJANO", 1),
(16,"CRISTINA", "JUAREZ", "FLORES", 1),
(21,"JOSE GABRIEL", "OLVERA", "GORDILLO", 1),
(25,"JOSHUA ALDAIR", "DIAZ", "AGUILAR", 1),
(40,"JESUS MANUEL", "LOPEZ", "CRUZ", 3),
(41,"MARIA LAURA", "LEON", "CORONA", 3),
(42,"BRENDA BERENIS", "TORRES", "CHAN", 3),
(43,"EDUARDO EMMANUEL", "ALAMILLA", "MIRANDA", 3),
(46,"EDUARDO", "QUE", "PIÑA", 3),
(50,"SERGIO RICARDO", "ALCOCER", "ALCOCER", 2),
(51,"RODOLFO RAUL", "ALTUNAR", "HERNANDEZ", 3),
(52,"CONCEPCION DEL ROSARIO","GUTIERREZ","GUZMAN", 2),
(53,"ABELARDO LEONEL","ALCOCER","CANTO", 2),
(54,"REYNALDO","DOMINGUEZ","JUAREZ", 2),
(55,"MARQUELY","MARTINEZ","CRUZ", 2),
(58,"GLORIA YULIANA","TRINIDAD","HERNANDEZ", 2),
(56,"JOSE ARMANDO","GARCIA","ESTRADA", 3),
(57,"JORGE LUIS","ELVIRA","OVANDO", 3),
(59,"JOSE DANIEL","DE LA ROSA","LOPEZ", 3),
(61,"SOFIA","DOMINGUEZ","GRACIA", 4),
(62,"AARON","POZO","VALENZUELA", 4),
(63,"CELIA GABRIELA","ABREU","VILLASEÑOR", 4),
(64,"FERNANDO","GOMEZ","CRUZ", 5),
(65,"YULISSA","GUTIERREZ","GUZMAN", 4),
(69,"PAULA CONCEPCION","ALCUDIA","PASCUAL", 4),
(71,"TILO","HERNANDEZ","DE LA CRUZ", 6),
(72,"JULIO CESAR","TEJERO","HERNANDEZ", 6),
(73,"ROSARIO DE LOS ANGELES","MORENO","ZAPATA", 6),
(76,"JUAN DE DIOS","CONTRERAS","HERNANDEZ", 6),
(77,"JOSE GUADALUPE","ACOSTA","CASTILLO", 6),
(82,"VERONICA","MARTINEZ","BALAM", 5),
(102,"KAREN PAOLA","GOMEZ","LOPEZ", 1),
(103,"ROSARIO FLORIDALMA","BORBON","ECHAVARRIA", 1),
(105,"ISABEL","ALVARADO","LOPEZ", 1),
(120,"JESUS EDUARDO","CHAN","MEDINA", 7),
(130,"LUIS ENRIQUE","ALAMILLA","FLORES", 8),
(131,"JOSE LUIS","CABRERA","AGUIRRE", 9),
(132,"FRANCISCO","BLANCO","LOPEZ", 9),
(133,"ANGEL JAIR","NUÑEZ","LIZCANO", 9); */

INSERT INTO empleado (idempleado, idchecador, nombre, apellido_paterno, apellido_materno, iddepartamento, estatus, edad, fecha_registro, update_time) VALUES
(1, 1,"JOSE MANUEL", "ECHAVARRIA", "LANDERO", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(2, 2,"ANDRES", "LANDERO", "JIMENEZ", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP), 
(3, 3,"JESUS MANUEL", "ALEGRIA", "JIMENEZ", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP), 
(4, 4,"JESUS ALEJANDRO", "GALLEGOS", "BAUTISTA", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(5, 5,"JOSE", "GUZMAN", "LOPEZ", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP), 
(6, 6,"DAVID JOSUE", "TORRES", "PACHECO", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(8, 8,"JAIRO", "LOYDE", "HERNANDEZ", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(9, 9,"REY NERIO TRINIDAD", "EHUAN", "LOPEZ", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(10, 10,"DAVID", "ALONSO", "CENTENO", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(11, 11,"LUIS JAVIER", "JIMENEZ", "HERNANDEZ", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(12, 12,"JUAN", "LIZCANO", "DIAZ", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(13, 13,"WALTER DAVID", "GUTIERREZ", "MANDUJANO", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(16, 16,"CRISTINA", "JUAREZ", "FLORES", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(21, 21,"JOSE GABRIEL", "OLVERA", "GORDILLO", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(25, 25,"JOSHUA ALDAIR", "DIAZ", "AGUILAR", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(40, 40,"JESUS MANUEL", "LOPEZ", "CRUZ", 3, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(41, 41,"MARIA LAURA", "LEON", "CORONA", 3, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(42, 42,"BRENDA BERENIS", "TORRES", "CHAN", 3, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(43, 43,"EDUARDO EMMANUEL", "ALAMILLA", "MIRANDA", 3, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(46, 46,"EDUARDO", "QUE", "PIÑA", 3, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(50, 50,"SERGIO RICARDO", "ALCOCER", "ALCOCER", 2, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(51, 51,"RODOLFO RAUL", "ALTUNAR", "HERNANDEZ", 3, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(52, 52,"CONCEPCION DEL ROSARIO","GUTIERREZ","GUZMAN", 2, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(53, 53,"ABELARDO LEONEL","ALCOCER","CANTO", 2, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(54, 54,"REYNALDO","DOMINGUEZ","JUAREZ", 2, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(55, 55,"MARQUELY","MARTINEZ","CRUZ", 2, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(58, 58,"GLORIA YULIANA","TRINIDAD","HERNANDEZ", 2, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(56, 56,"JOSE ARMANDO","GARCIA","ESTRADA", 3, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(57, 57,"JORGE LUIS","ELVIRA","OVANDO", 3, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(59, 59,"JOSE DANIEL","DE LA ROSA","LOPEZ", 3, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(61, 61,"SOFIA","DOMINGUEZ","GRACIA", 4, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(62, 62,"AARON","POZO","VALENZUELA", 4, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(63, 63,"CELIA GABRIELA","ABREU","VILLASEÑOR", 4, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(64, 64,"FERNANDO","GOMEZ","CRUZ", 5, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(65, 65,"YULISSA","GUTIERREZ","GUZMAN", 4, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(69, 69,"PAULA CONCEPCION","ALCUDIA","PASCUAL", 4, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(71, 71,"TILO","HERNANDEZ","DE LA CRUZ", 6, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(72, 72,"JULIO CESAR","TEJERO","HERNANDEZ", 6, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(73, 73,"ROSARIO DE LOS ANGELES","MORENO","ZAPATA", 6, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(76, 76,"JUAN DE DIOS","CONTRERAS","HERNANDEZ", 6, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(77, 77,"JOSE GUADALUPE","ACOSTA","CASTILLO", 6, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(82, 82,"VERONICA","MARTINEZ","BALAM", 5, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(102, 102,"KAREN PAOLA","GOMEZ","LOPEZ", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(103, 103,"ROSARIO FLORIDALMA","BORBON","ECHAVARRIA", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(105, 105,"ISABEL","ALVARADO","LOPEZ", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(120, 120,"JESUS EDUARDO","CHAN","MEDINA", 7, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(130, 130,"LUIS ENRIQUE","ALAMILLA","FLORES", 8, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(131, 131,"JOSE LUIS","CABRERA","AGUIRRE", 9, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(132, 132,"FRANCISCO","BLANCO","LOPEZ", 9, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(133, 133,"ANGEL JAIR","NUÑEZ","LIZCANO", 9, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP);

INSERT INTO monto_faltante VALUES 
(null, 121.71, "2022-12-02", 40),
(null, 121.71, "2022-12-06", 40),
(null, 70.02, "2022-12-09", 8),
(null, 175.64, "2022-12-10", 10);

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

INSERT INTO oyl_cumplimiento (idoyl_cumplimiento, cumplimiento, descripcion, parte) VALUES 
(1, "Exibidor de aceite", "productos ordenados", "Parte 1. Elementos de la isla"),
(2, "Contenedor limpiaparabrisas", "sin roturas", "Parte 1. Elementos de la isla"),
(3, "Manguera de la bomba", "enrrolladas sin tocar el piso", "Parte 1. Elementos de la isla"),
(4, "Manguera despachadora de agua y aire", "enrrolladas sin tocar el piso", "Parte 1. Elementos de la isla"),
(5, "Maseteros", "sin basura", "Parte 1. Elementos de la isla"),
(6, "Bomba limpia", "sin lodo o polvo", "Parte 2. Limpieza de la isla"),
(7, "Piso limpio de la isla", "sin lodo o polvo", "Parte 2. Limpieza de la isla"),
(8, "Isla limpia", "sin basura", "Parte 2. Limpieza de la isla"),
(9, "Franja amarilla isla", "sin lodo o polvo", "Parte 2. Limpieza de la isla"),
(10, "Contenedor de agua para limpiaparabrisas", "sin lodo o polvo", "Parte 2. Limpieza de la isla");

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
(12, "Actualizar datos", "Orden y limpieza", 2, "Das permiso de que el usuario pueda ver y actualizar datos en orden y limpieza"),
(13, "Eliminar datos", "Orden y limpieza", 2, "Das permiso de que el usuario pueda eliminar datos"),
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
(25, "Obtener y capturar", "Orden y limpieza", 2, "Das permiso de que el usuario pueda obtener y crear nuevos datos en el área de orden y limpieza"),
(48, "Visualizar usuarios", "Permisos", 8, "Das permiso de que el usuario pueda ver enlistada a los empleados y usuarios"),
(49, "Establecer usuario", "Permisos", 8, "Das permiso de que el usuario pueda crear un usuario a un empleado"),
(50, "Establecer permisos", "Permisos", 8, "Das permiso de que el usuario establecer permisos a los demas usuarios");

INSERT INTO acceso (user, idpermiso) VALUES 
("sralcocer", 1);