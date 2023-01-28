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
(1, "INCUMPLIMIENTO REGLAS"),
(2, "RETARDOS"),
(3, "CHECKLIST ERRONEO"),
(4, "RELOJ CHECADOR"),
(5, "HOJAS DE LIQUIDACION"),
(6, "MONTOS FALTANTES"),
(7, "FALTA RECURSOS"),
(8, "FALTAS"),
(9, "RECOLECCION DE EFECTIVO"),
(10, "VENTA Y COBRO DE EFECTIVO"),
(11, "UNIFORME DE DESPACHO");

INSERT INTO empleado (idempleado, nombre, apellido_paterno, apellido_materno, iddepartamento) VALUES
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
(133,"ANGEL JAIR","NUÑEZ","LIZCANO", 9);

INSERT INTO solicitud_empleo (idempleado, nombre, apellido_paterno, apellido_materno, iddepartamento, estatus, edad, fecha_registro, update_time) VALUES
(1,"JOSE MANUEL", "ECHAVARRIA", "LANDERO", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(2,"ANDRES", "LANDERO", "JIMENEZ", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP), 
(3,"JESUS MANUEL", "ALEGRIA", "JIMENEZ", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP), 
(4,"JESUS ALEJANDRO", "GALLEGOS", "BAUTISTA", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(5,"JOSE", "GUZMAN", "LOPEZ", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP), 
(6,"DAVID JOSUE", "TORRES", "PACHECO", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(8,"JAIRO", "LOYDE", "HERNANDEZ", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(9,"REY NERIO TRINIDAD", "EHUAN", "LOPEZ", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(10,"DAVID", "ALONSO", "CENTENO", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(11,"LUIS JAVIER", "JIMENEZ", "HERNANDEZ", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(12,"JUAN", "LIZCANO", "DIAZ", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(13,"WALTER DAVID", "GUTIERREZ", "MANDUJANO", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(16,"CRISTINA", "JUAREZ", "FLORES", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(21,"JOSE GABRIEL", "OLVERA", "GORDILLO", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(25,"JOSHUA ALDAIR", "DIAZ", "AGUILAR", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(40,"JESUS MANUEL", "LOPEZ", "CRUZ", 3, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(41,"MARIA LAURA", "LEON", "CORONA", 3, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(42,"BRENDA BERENIS", "TORRES", "CHAN", 3, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(43,"EDUARDO EMMANUEL", "ALAMILLA", "MIRANDA", 3, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(46,"EDUARDO", "QUE", "PIÑA", 3, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(50,"SERGIO RICARDO", "ALCOCER", "ALCOCER", 2, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(51,"RODOLFO RAUL", "ALTUNAR", "HERNANDEZ", 3, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(52,"CONCEPCION DEL ROSARIO","GUTIERREZ","GUZMAN", 2, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(53,"ABELARDO LEONEL","ALCOCER","CANTO", 2, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(54,"REYNALDO","DOMINGUEZ","JUAREZ", 2, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(55,"MARQUELY","MARTINEZ","CRUZ", 2, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(58,"GLORIA YULIANA","TRINIDAD","HERNANDEZ", 2, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(56,"JOSE ARMANDO","GARCIA","ESTRADA", 3, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(57,"JORGE LUIS","ELVIRA","OVANDO", 3, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(59,"JOSE DANIEL","DE LA ROSA","LOPEZ", 3, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(61,"SOFIA","DOMINGUEZ","GRACIA", 4, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(62,"AARON","POZO","VALENZUELA", 4, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(63,"CELIA GABRIELA","ABREU","VILLASEÑOR", 4, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(64,"FERNANDO","GOMEZ","CRUZ", 5, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(65,"YULISSA","GUTIERREZ","GUZMAN", 4, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(69,"PAULA CONCEPCION","ALCUDIA","PASCUAL", 4, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(71,"TILO","HERNANDEZ","DE LA CRUZ", 6, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(72,"JULIO CESAR","TEJERO","HERNANDEZ", 6, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(73,"ROSARIO DE LOS ANGELES","MORENO","ZAPATA", 6, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(76,"JUAN DE DIOS","CONTRERAS","HERNANDEZ", 6, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(77,"JOSE GUADALUPE","ACOSTA","CASTILLO", 6, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(82,"VERONICA","MARTINEZ","BALAM", 5, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(102,"KAREN PAOLA","GOMEZ","LOPEZ", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(103,"ROSARIO FLORIDALMA","BORBON","ECHAVARRIA", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(105,"ISABEL","ALVARADO","LOPEZ", 1, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(120,"JESUS EDUARDO","CHAN","MEDINA", 7, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(130,"LUIS ENRIQUE","ALAMILLA","FLORES", 8, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(131,"JOSE LUIS","CABRERA","AGUIRRE", 9, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(132,"FRANCISCO","BLANCO","LOPEZ", 9, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP),
(133,"ANGEL JAIR","NUÑEZ","LIZCANO", 9, 1, 50, "2022-12-14 00:00:00", CURRENT_TIMESTAMP);

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

INSERT INTO tipo_falta VALUES
(1, "Todo en orden", "El empleado establecio su entrada correctamente", 0, "RGBA(56,255,136,1)"),
(2, "Falta justificable", "El empleado tiene justificada su falta", 0, "RGBA(0,157,19,1)"),
(3, "Dia de descanso", "El empleado descanso", 0, "RGBA(213,86,12,1)"),
(4, "Falta", "El empleado falto ese dia", 1, "RGBA(253,234,0,1)"),
(5, "Retardo", "El empleado llego despues de su hora de entrada", 1, "RGBA(253,234,0,1)"),
(6, "Capacitacion", "El empleado estuvo en capacitación", 0, "RGBA(0,209,141,1)"),
(7, "No checo entrada", "El empleado por algun motivo no capturo la entrada pero si trabajo", 1, "RGBA(209,0,39,1)");

INSERT INTO concurso VALUES 
(1, "madrugador"),
(2, "octanoso"),
(3, "aceitoso");

INSERT INTO user VALUES 
("sralcocer", "sralcocer@donlalo.com.mx", MD5("alcocer2023"), CURRENT_TIME, 50),
("jose", "jose@donlalo.com.mx", MD5("jose2023"), CURRENT_TIME, 51),
("raul_al", "raul_al@donlalo.com.mx", MD5("altunar2023"), CURRENT_TIME, 77);

INSERT INTO permiso (idpermiso, permiso, peticion, departamento) VALUES 
(1, "Universal", "Universal", 1),
( 2, "obtener y capturar datos", "Monto Faltante", 2)
(3, "actualizar", "Monto Faltante", 2),
(4, "eliminar", "Monto Faltante", 2),
(5, "obtener y capturar datos", "Checklist Bomba", 2),
(6, "actualizar", "Checklist Bomba", 2),
(7, "eliminar", "Checklist Bomba", 2),
(8, "obtener y capturar datos", "Evaluación Uniforme", 2),
(9, "actualizar", "Evaluación Uniforme", 2),
(10, "eliminar", "Evaluación Uniforme", 2),
(11, "obtener y capturar datos", "Recolección Efectivo", 2),
(12, "actualizar", "Recolección Efectivo", 2),
(13, "eliminar", "Recolección Efectivo", 2),
(14, "obtener y capturar datos", "Pasos Para Despachar", 2),
(15, "actualizar", "Pasos Para Despachar", 2),
(16, "eliminar", "Pasos Para Despachar", 2),
(17, "obtener y capturar datos", "Recursos Despachador", 2),
(18, "actualizar", "Recursos Despachador", 2),
(19, "eliminar", "Recursos Despachador", 2),
(20, "obtener y capturar datos", "Salidas No Conformes", 3),
(21, "actualizar", "Salidas No Conformes", 3),
(22, "eliminar", "Salidas No Conformes", 3);

INSERT INTO acceso (user, idpermiso) VALUES 
("sralcocer", 1),
("raul_al", 2),
("raul_al", 3),
("raul_al", 4),
("raul_al", 5),
("raul_al", 6),
("raul_al", 7),
("raul_al", 8),
("raul_al", 9),
("raul_al", 10),
("raul_al", 11),
("raul_al", 12),
("raul_al", 13),
("raul_al", 14),
("raul_al", 15),
("raul_al", 16),
("raul_al", 17),
("raul_al", 18),
("raul_al", 19),
("raul_al", 20),
("raul_al", 21),
("raul_al", 22),
("jose", 2),
("jose", 5),
("jose", 8),
("jose", 11),
("jose", 14),
("jose", 17),
("jose", 20);

INSERT INTO acceso VALUES ("sralcocer", )