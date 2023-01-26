-- MySQL Script generated by MySQL Workbench
-- Tue Jan 24 14:19:51 2023
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema GasDonLalo
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema gasdonlalo
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Table `departamento`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `departamento` ;

CREATE TABLE IF NOT EXISTS `departamento` (
  `iddepartamento` INT NOT NULL AUTO_INCREMENT,
  `departamento` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`iddepartamento`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `empleado`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `empleado` ;

CREATE TABLE IF NOT EXISTS `empleado` (
  `idempleado` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(30) NOT NULL,
  `apellido_paterno` VARCHAR(30) NOT NULL,
  `apellido_materno` VARCHAR(30) NOT NULL,
  `departamento` INT NOT NULL,
  PRIMARY KEY (`idempleado`),
  INDEX `fk_Empleado_Departamento_idx` (`departamento` ASC) VISIBLE,
  CONSTRAINT `fk_Empleado_Departamento`
    FOREIGN KEY (`departamento`)
    REFERENCES `departamento` (`iddepartamento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `monto_faltante`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `monto_faltante` ;

CREATE TABLE IF NOT EXISTS `monto_faltante` (
  `idmonto_faltante` INT NOT NULL AUTO_INCREMENT,
  `cantidad` DECIMAL(10,2) NOT NULL,
  `fecha` DATE NOT NULL,
  `empleado` INT NOT NULL,
  PRIMARY KEY (`idmonto_faltante`),
  INDEX `fk_monto_faltante_Empleado1_idx` (`empleado` ASC) VISIBLE,
  CONSTRAINT `fk_monto_faltante_Empleado1`
    FOREIGN KEY (`empleado`)
    REFERENCES `empleado` (`idempleado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `incumplimiento`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `incumplimiento` ;

CREATE TABLE IF NOT EXISTS `incumplimiento` (
  `idincumplimiento` INT NOT NULL AUTO_INCREMENT,
  `incumplimiento` VARCHAR(45) NOT NULL,
  `departamento` INT NOT NULL,
  PRIMARY KEY (`idincumplimiento`),
  INDEX `fk_incumplimiento_departamento1_idx` (`departamento` ASC) VISIBLE,
  CONSTRAINT `fk_incumplimiento_departamento1`
    FOREIGN KEY (`departamento`)
    REFERENCES `departamento` (`iddepartamento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `formato_salidas_no_conformes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `formato_salidas_no_conformes` ;

CREATE TABLE IF NOT EXISTS `formato_salidas_no_conformes` (
  `idsalidas_no_conformes` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATE NOT NULL,
  `descripcion_falla` TEXT NULL,
  `acciones_corregir` TEXT NULL,
  `concesiones` TEXT NULL,
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `tipo_incumplimiento` INT NOT NULL,
  PRIMARY KEY (`idsalidas_no_conformes`),
  INDEX `fk_formato_salidas_no_conformes_incumplimiento1_idx` (`tipo_incumplimiento` ASC) VISIBLE,
  CONSTRAINT `fk_formato_salidas_no_conformes_incumplimiento1`
    FOREIGN KEY (`tipo_incumplimiento`)
    REFERENCES `incumplimiento` (`idincumplimiento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `user` ;

CREATE TABLE IF NOT EXISTS `user` (
  `username` VARCHAR(16) NOT NULL,
  `email` VARCHAR(255) NULL,
  `password` VARCHAR(32) NOT NULL,
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `empleado` INT NOT NULL,
  INDEX `fk_user_empleado1_idx` (`empleado` ASC) VISIBLE,
  CONSTRAINT `fk_user_empleado1`
    FOREIGN KEY (`empleado`)
    REFERENCES `empleado` (`idempleado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `estacion_servicio`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `estacion_servicio` ;

CREATE TABLE IF NOT EXISTS `estacion_servicio` (
  `idestacion_servicio` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `latitud` DECIMAL(10,6) NULL,
  `longitud` DECIMAL(10,6) NULL,
  `imagen` VARCHAR(45) NULL DEFAULT 'http://localhost:4000/estaciones/gdl1.jpg',
  PRIMARY KEY (`idestacion_servicio`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bomba`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `bomba` ;

CREATE TABLE IF NOT EXISTS `bomba` (
  `idbomba` INT NOT NULL,
  `num_bomba` INT NOT NULL,
  `bomba` VARCHAR(45) NULL,
  `estacion_servicio` INT NOT NULL,
  PRIMARY KEY (`idbomba`),
  INDEX `fk_bomba_estacion_servicio1_idx` (`estacion_servicio` ASC) VISIBLE,
  CONSTRAINT `fk_bomba_estacion_servicio1`
    FOREIGN KEY (`estacion_servicio`)
    REFERENCES `estacion_servicio` (`idestacion_servicio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `checklist_bomba`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `checklist_bomba` ;

CREATE TABLE IF NOT EXISTS `checklist_bomba` (
  `idchecklist_bomba` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATETIME NULL,
  `isla_limpia` BIT NULL,
  `aceites_completos` BIT NULL,
  `bomba` INT NULL,
  `turno` ENUM("Mañana", "Tarde", "Noche") NULL,
  `empleado_entrante` INT NULL,
  `empleado_saliente` INT NULL,
  PRIMARY KEY (`idchecklist_bomba`),
  INDEX `fk_check_bomba1_idx` (`bomba` ASC) VISIBLE,
  INDEX `fk_check_empleado1_idx` (`empleado_entrante` ASC) VISIBLE,
  INDEX `fk_check_empleado2_idx` (`empleado_saliente` ASC) VISIBLE,
  CONSTRAINT `fk_check_bomba1`
    FOREIGN KEY (`bomba`)
    REFERENCES `bomba` (`idbomba`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_check_empleado1`
    FOREIGN KEY (`empleado_entrante`)
    REFERENCES `empleado` (`idempleado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_check_empleado2`
    FOREIGN KEY (`empleado_saliente`)
    REFERENCES `empleado` (`idempleado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `puntaje_minimo`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `puntaje_minimo` ;

CREATE TABLE IF NOT EXISTS `puntaje_minimo` (
  `idpuntaje_minimo` INT NOT NULL AUTO_INCREMENT,
  `tabla_captura` VARCHAR(20) NOT NULL,
  `puntaje` INT NOT NULL,
  PRIMARY KEY (`idpuntaje_minimo`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mantenimiento`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mantenimiento` ;

CREATE TABLE IF NOT EXISTS `mantenimiento` (
  `idmantenimiento` INT NOT NULL AUTO_INCREMENT,
  `mantenimiento` VARCHAR(15) NOT NULL,
  PRIMARY KEY (`idmantenimiento`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `area`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `area` ;

CREATE TABLE IF NOT EXISTS `area` (
  `idarea` INT NOT NULL AUTO_INCREMENT,
  `area` VARCHAR(25) NOT NULL,
  `idmantenimiento` INT NOT NULL,
  PRIMARY KEY (`idarea`),
  INDEX `fk_area_mantenimiento1_idx` (`idmantenimiento` ASC) VISIBLE,
  CONSTRAINT `fk_area_mantenimiento1`
    FOREIGN KEY (`idmantenimiento`)
    REFERENCES `mantenimiento` (`idmantenimiento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `estacion_servicio`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `estacion_servicio` ;

CREATE TABLE IF NOT EXISTS `estacion_servicio` (
  `idestacion_servicio` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `latitud` DECIMAL(10,6) NULL DEFAULT NULL,
  `longitud` DECIMAL(10,6) NULL DEFAULT NULL,
  `imagen` VARCHAR(45) NULL DEFAULT 'http://localhost:4000/estaciones/gdl1.jpg',
  PRIMARY KEY (`idestacion_servicio`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `departamento`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `departamento` ;

CREATE TABLE IF NOT EXISTS `departamento` (
  `iddepartamento` INT NOT NULL AUTO_INCREMENT,
  `departamento` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`iddepartamento`))
ENGINE = InnoDB
AUTO_INCREMENT = 10
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `empleado`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `empleado` ;

CREATE TABLE IF NOT EXISTS `empleado` (
  `idempleado` INT NOT NULL,
  `nombre` VARCHAR(30) NOT NULL,
  `apellido_paterno` VARCHAR(30) NOT NULL,
  `apellido_materno` VARCHAR(30) NOT NULL,
  `iddepartamento` INT NOT NULL,
  `estatus` INT NOT NULL DEFAULT 1,
  `date_baja` DATE NULL DEFAULT NULL,
  PRIMARY KEY (`idempleado`),
  INDEX `fk_Empleado_Departamento_idx` (`iddepartamento` ASC) VISIBLE,
  CONSTRAINT `fk_Empleado_Departamento`
    FOREIGN KEY (`iddepartamento`)
    REFERENCES `departamento` (`iddepartamento`))
ENGINE = InnoDB
AUTO_INCREMENT = 134
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `otrabajo_mantenimiento`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `otrabajo_mantenimiento` ;

CREATE TABLE IF NOT EXISTS `otrabajo_mantenimiento` (
  `idotrabajo_mantenimiento` INT NOT NULL AUTO_INCREMENT,
  `tipo_mantenimiento` ENUM("Correctivo", "Preventivo") NOT NULL,
  `fecha_inicio` DATETIME NOT NULL,
  `fecha_termino` DATETIME NOT NULL,
  `descripcion_falla` TEXT NULL,
  `idarea` INT NOT NULL,
  `idestacion_servicio` INT NOT NULL,
  `idempleado_solicita` INT NOT NULL,
  PRIMARY KEY (`idotrabajo_mantenimiento`),
  INDEX `fk_otrabajo_mantenimiento_area1_idx` (`idarea` ASC) VISIBLE,
  INDEX `fk_otrabajo_mantenimiento_estacion_servicio1_idx` (`idestacion_servicio` ASC) VISIBLE,
  INDEX `fk_otrabajo_mantenimiento_empleado1_idx` (`idempleado_solicita` ASC) VISIBLE,
  CONSTRAINT `fk_otrabajo_mantenimiento_area1`
    FOREIGN KEY (`idarea`)
    REFERENCES `area` (`idarea`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_otrabajo_mantenimiento_estacion_servicio1`
    FOREIGN KEY (`idestacion_servicio`)
    REFERENCES `gasdonlalo`.`estacion_servicio` (`idestacion_servicio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_otrabajo_mantenimiento_empleado1`
    FOREIGN KEY (`idempleado_solicita`)
    REFERENCES `gasdonlalo`.`empleado` (`idempleado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `documento`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `documento` ;

CREATE TABLE IF NOT EXISTS `documento` (
  `iddocumento` INT NOT NULL AUTO_INCREMENT,
  `documento` VARCHAR(40) NOT NULL,
  PRIMARY KEY (`iddocumento`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `control_documento`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `control_documento` ;

CREATE TABLE IF NOT EXISTS `control_documento` (
  `idcontrol_documento` INT NOT NULL AUTO_INCREMENT,
  `cumple` BIT NOT NULL,
  `idempleado` INT NOT NULL,
  `iddocumento` INT NOT NULL,
  PRIMARY KEY (`idcontrol_documento`),
  INDEX `fk_control_documento_empleado1_idx` (`idempleado` ASC) VISIBLE,
  INDEX `fk_control_documento_documento1_idx` (`iddocumento` ASC) VISIBLE,
  CONSTRAINT `fk_control_documento_empleado1`
    FOREIGN KEY (`idempleado`)
    REFERENCES `gasdonlalo`.`empleado` (`idempleado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_control_documento_documento1`
    FOREIGN KEY (`iddocumento`)
    REFERENCES `documento` (`iddocumento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `solicitud_empleo`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `solicitud_empleo` ;

CREATE TABLE IF NOT EXISTS `solicitud_empleo` (
  `idsolicitud_empleo` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(30) NOT NULL,
  `apellido_paterno` VARCHAR(30) NOT NULL,
  `apellido_materno` VARCHAR(30) NOT NULL,
  `estatus` ENUM("Contrato", "Practica", "Despido", "Rechazo", "Pendiente") NOT NULL,
  `edad` INT NULL,
  `fecha_registro` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `idempleado` INT NULL COMMENT 'El id empleado no sera un valor llave, porque esta se rellenara repecto al id que se genere en el checador de entrada/salida y cuando el estatus cambie a practica o contrato, el id se rellenara al idempleado (\"llave de la tabla empleado\") con todos los valores.',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `iddepartamento` INT NOT NULL,
  `motivo` TEXT NULL COMMENT 'Puede ir vacia, solo es valido cuando la solicitud esta rechazada o despido',
  PRIMARY KEY (`idsolicitud_empleo`),
  UNIQUE INDEX `idempleado_UNIQUE` (`idempleado` ASC) VISIBLE,
  INDEX `fk_solicitud_empleo_departamento1_idx` (`iddepartamento` ASC) VISIBLE,
  CONSTRAINT `fk_solicitud_empleo_departamento1`
    FOREIGN KEY (`iddepartamento`)
    REFERENCES `gasdonlalo`.`departamento` (`iddepartamento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `turno`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `turno` ;

CREATE TABLE IF NOT EXISTS `turno` (
  `idturno` INT NOT NULL AUTO_INCREMENT,
  `turno` VARCHAR(6) NOT NULL,
  `hora_empiezo` TIME NOT NULL,
  `hora_termino` TIME NOT NULL,
  `hora_anticipo` TIME NOT NULL,
  PRIMARY KEY (`idturno`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tipo_falta`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tipo_falta` ;

CREATE TABLE IF NOT EXISTS `tipo_falta` (
  `idtipo_falta` INT NOT NULL AUTO_INCREMENT,
  `tipo` VARCHAR(30) NOT NULL,
  `descripcion` TEXT NULL COMMENT 'Se le puede añadir una descripcion a la razon de la falta o puede ir vacio si asi lo desean\n',
  `inconforme` BIT NOT NULL DEFAULT 1 COMMENT 'Recibe un valor booleano\ntrue es que la falta que puede generar una inconformidad y false es lo contrario, puede ser una falta justificable y no repercutrir al empleado, el primer dato de esta tabla sera un false por si el empleado capturo en orden',
  `color` VARCHAR(31) NOT NULL DEFAULT 'rgba(255, 255, 0, 1)',
  PRIMARY KEY (`idtipo_falta`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `captura_entrada`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `captura_entrada` ;

CREATE TABLE IF NOT EXISTS `captura_entrada` (
  `idcaptura_entrada` INT NOT NULL AUTO_INCREMENT,
  `hora_entrada` TIME NULL,
  `fecha` DATE NOT NULL,
  `idturno` INT NOT NULL,
  `idtipo_falta` INT NOT NULL COMMENT 'Es caso de que no alla ninguna inconformidad con la entrada, se le asignara siempre el id 1',
  `idempleado` INT NOT NULL,
  `hora_entrada_permitida` TIME NULL COMMENT 'En algunas ocaciones no siempre el empleado tiene que entrar en los horarios establecido, si no que aveces se le asigna una hora por tal motivo, por lo que esta propiedad deber ser opcional',
  PRIMARY KEY (`idcaptura_entrada`),
  INDEX `fk_captura_entrada_turno1_idx` (`idturno` ASC) VISIBLE,
  INDEX `fk_captura_entrada_tipo_falta1_idx` (`idtipo_falta` ASC) VISIBLE,
  INDEX `fk_captura_entrada_empleado1_idx` (`idempleado` ASC) VISIBLE,
  CONSTRAINT `fk_captura_entrada_turno1`
    FOREIGN KEY (`idturno`)
    REFERENCES `turno` (`idturno`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_captura_entrada_tipo_falta1`
    FOREIGN KEY (`idtipo_falta`)
    REFERENCES `tipo_falta` (`idtipo_falta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_captura_entrada_empleado1`
    FOREIGN KEY (`idempleado`)
    REFERENCES `gasdonlalo`.`empleado` (`idempleado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `venta_litros`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `venta_litros` ;

CREATE TABLE IF NOT EXISTS `venta_litros` (
  `idventa_litros` INT NOT NULL AUTO_INCREMENT,
  `cantidad` DECIMAL(10,2) NOT NULL,
  `fecha` DATE NOT NULL,
  `idempleado` INT NOT NULL,
  `idestacion_servicio` INT NOT NULL,
  `descalificado` BIT NULL DEFAULT 0,
  PRIMARY KEY (`idventa_litros`),
  INDEX `fk_venta_litros_empleado1_idx` (`idempleado` ASC) VISIBLE,
  INDEX `fk_venta_litros_estacion_servicio1_idx` (`idestacion_servicio` ASC) VISIBLE,
  CONSTRAINT `fk_venta_litros_empleado1`
    FOREIGN KEY (`idempleado`)
    REFERENCES `gasdonlalo`.`empleado` (`idempleado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_venta_litros_estacion_servicio1`
    FOREIGN KEY (`idestacion_servicio`)
    REFERENCES `gasdonlalo`.`estacion_servicio` (`idestacion_servicio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `venta_aceite`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `venta_aceite` ;

CREATE TABLE IF NOT EXISTS `venta_aceite` (
  `idventa_aceite` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATE NOT NULL,
  `cantidad` DECIMAL(10,2) NOT NULL,
  `idempleado` INT NOT NULL,
  `idestacion_servicio` INT NOT NULL,
  `descalificado` BIT NULL DEFAULT 0,
  PRIMARY KEY (`idventa_aceite`),
  INDEX `fk_venta_aceite_empleado1_idx` (`idempleado` ASC) VISIBLE,
  INDEX `fk_venta_aceite_estacion_servicio1_idx` (`idestacion_servicio` ASC) VISIBLE,
  CONSTRAINT `fk_venta_aceite_empleado1`
    FOREIGN KEY (`idempleado`)
    REFERENCES `gasdonlalo`.`empleado` (`idempleado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_venta_aceite_estacion_servicio1`
    FOREIGN KEY (`idestacion_servicio`)
    REFERENCES `gasdonlalo`.`estacion_servicio` (`idestacion_servicio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `recurso_entrega`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `recurso_entrega` ;

CREATE TABLE IF NOT EXISTS `recurso_entrega` (
  `idrecurso_entrega` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATE NOT NULL,
  `cantidad` INT NOT NULL,
  `recurso` TEXT NOT NULL,
  `idempleado_recibe` INT NOT NULL,
  PRIMARY KEY (`idrecurso_entrega`),
  INDEX `fk_recurso_entrega_empleado1_idx` (`idempleado_recibe` ASC) VISIBLE,
  CONSTRAINT `fk_recurso_entrega_empleado1`
    FOREIGN KEY (`idempleado_recibe`)
    REFERENCES `gasdonlalo`.`empleado` (`idempleado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `concurso`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `concurso` ;

CREATE TABLE IF NOT EXISTS `concurso` (
  `idconcurso` INT NOT NULL AUTO_INCREMENT,
  `concurso` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idconcurso`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `incumplimiento`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `incumplimiento` ;

CREATE TABLE IF NOT EXISTS `incumplimiento` (
  `idincumplimiento` INT NOT NULL AUTO_INCREMENT,
  `incumplimiento` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idincumplimiento`))
ENGINE = InnoDB
AUTO_INCREMENT = 12
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `categorizar_incumplimiento`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `categorizar_incumplimiento` ;

CREATE TABLE IF NOT EXISTS `categorizar_incumplimiento` (
  `idconcurso` INT NOT NULL,
  `idincumplimiento` INT NOT NULL,
  PRIMARY KEY (`idconcurso`, `idincumplimiento`),
  INDEX `fk_concurso_has_incumplimiento_incumplimiento1_idx` (`idincumplimiento` ASC) VISIBLE,
  INDEX `fk_concurso_has_incumplimiento_concurso1_idx` (`idconcurso` ASC) VISIBLE,
  CONSTRAINT `fk_concurso_has_incumplimiento_concurso1`
    FOREIGN KEY (`idconcurso`)
    REFERENCES `concurso` (`idconcurso`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_concurso_has_incumplimiento_incumplimiento1`
    FOREIGN KEY (`idincumplimiento`)
    REFERENCES `gasdonlalo`.`incumplimiento` (`idincumplimiento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bomba`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `bomba` ;

CREATE TABLE IF NOT EXISTS `bomba` (
  `idbomba` INT NOT NULL AUTO_INCREMENT,
  `num_bomba` INT NOT NULL,
  `bomba` VARCHAR(45) NULL DEFAULT NULL,
  `idestacion_servicio` INT NOT NULL,
  PRIMARY KEY (`idbomba`),
  INDEX `fk_bomba_estacion_servicio1_idx` (`idestacion_servicio` ASC) VISIBLE,
  CONSTRAINT `fk_bomba_estacion_servicio1`
    FOREIGN KEY (`idestacion_servicio`)
    REFERENCES `estacion_servicio` (`idestacion_servicio`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `checklist_bomba`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `checklist_bomba` ;

CREATE TABLE IF NOT EXISTS `checklist_bomba` (
  `idchecklist_bomba` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATE NOT NULL,
  `isla_limpia` BIT(1) NOT NULL,
  `aceites_completos` BIT(1) NOT NULL,
  `idbomba` INT NOT NULL,
  `turno` ENUM('Mañana', 'Tarde', 'Noche') NOT NULL,
  `idempleado_entrante` INT NOT NULL,
  `idempleado_saliente` INT NOT NULL,
  `idpuntaje_minimo` INT NOT NULL,
  PRIMARY KEY (`idchecklist_bomba`),
  INDEX `fk_check_bomba1_idx` (`idbomba` ASC) VISIBLE,
  INDEX `fk_check_empleado1_idx` (`idempleado_entrante` ASC) VISIBLE,
  INDEX `fk_check_empleado2_idx` (`idempleado_saliente` ASC) VISIBLE,
  INDEX `fk_checklist_bomba_puntaje_minimo1_idx` (`idpuntaje_minimo` ASC) VISIBLE,
  CONSTRAINT `fk_check_bomba1`
    FOREIGN KEY (`idbomba`)
    REFERENCES `bomba` (`idbomba`),
  CONSTRAINT `fk_check_empleado1`
    FOREIGN KEY (`idempleado_entrante`)
    REFERENCES `empleado` (`idempleado`),
  CONSTRAINT `fk_check_empleado2`
    FOREIGN KEY (`idempleado_saliente`)
    REFERENCES `empleado` (`idempleado`),
  CONSTRAINT `fk_checklist_bomba_puntaje_minimo1`
    FOREIGN KEY (`idpuntaje_minimo`)
    REFERENCES `GasDonLalo`.`puntaje_minimo` (`idpuntaje_minimo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `paso_despachar`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `paso_despachar` ;

CREATE TABLE IF NOT EXISTS `paso_despachar` (
  `idpaso_despachar` INT NOT NULL AUTO_INCREMENT,
  `paso` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idpaso_despachar`))
ENGINE = InnoDB
AUTO_INCREMENT = 37
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `evaluacion_despachar`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `evaluacion_despachar` ;

CREATE TABLE IF NOT EXISTS `evaluacion_despachar` (
  `idevaluacion_despachar` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATE NOT NULL,
  `idempleado` INT NOT NULL,
  `idpaso_despachar` INT NOT NULL,
  `evaluacion` BIT NOT NULL DEFAULT 0,
  `create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `identificador` CHAR(34) NOT NULL,
  PRIMARY KEY (`idevaluacion_despachar`),
  INDEX `fk_pasos_para_despachar_empleado1_idx` (`idempleado` ASC) VISIBLE,
  INDEX `fk_evaluacion_para_despachar_pasos_para_despachar1_idx` (`idpaso_despachar` ASC) VISIBLE,
  CONSTRAINT `fk_evaluacion_para_despachar_pasos_para_despachar1`
    FOREIGN KEY (`idpaso_despachar`)
    REFERENCES `paso_despachar` (`idpaso_despachar`),
  CONSTRAINT `fk_pasos_para_despachar_empleado1`
    FOREIGN KEY (`idempleado`)
    REFERENCES `empleado` (`idempleado`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `cumplimiento_uniforme`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cumplimiento_uniforme` ;

CREATE TABLE IF NOT EXISTS `cumplimiento_uniforme` (
  `idcumplimiento_uniforme` INT NOT NULL AUTO_INCREMENT,
  `cumplimiento` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idcumplimiento_uniforme`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `evaluacion_uniforme`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `evaluacion_uniforme` ;

CREATE TABLE IF NOT EXISTS `evaluacion_uniforme` (
  `idevaluacion_uniforme` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATE NOT NULL,
  `idempleado` INT NOT NULL,
  `idcumplimiento_uniforme` INT NOT NULL,
  `idpuntaje_minimo` INT NOT NULL,
  `cumple` BIT NOT NULL,
  `identificador` CHAR(34) NOT NULL,
  PRIMARY KEY (`idevaluacion_uniforme`),
  INDEX `fk_evaluación_de_uniforme_empleado1_idx` (`idempleado` ASC) VISIBLE,
  INDEX `fk_evaluaciones_evaluaciones_de_uniforme1_idx` (`idcumplimiento_uniforme` ASC) VISIBLE,
  INDEX `fk_evaluacion_uniforme_puntaje_minimo1_idx` (`idpuntaje_minimo` ASC) VISIBLE,
  CONSTRAINT `fk_evaluaciones_evaluaciones_de_uniforme1`
    FOREIGN KEY (`idcumplimiento_uniforme`)
    REFERENCES `cumplimiento_uniforme` (`idcumplimiento_uniforme`),
  CONSTRAINT `fk_evaluación_de_uniforme_empleado1`
    FOREIGN KEY (`idempleado`)
    REFERENCES `empleado` (`idempleado`),
  CONSTRAINT `fk_evaluacion_uniforme_puntaje_minimo1`
    FOREIGN KEY (`idpuntaje_minimo`)
    REFERENCES `GasDonLalo`.`puntaje_minimo` (`idpuntaje_minimo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `salida_noconforme`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `salida_noconforme` ;

CREATE TABLE IF NOT EXISTS `salida_noconforme` (
  `idsalida_noconforme` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATE NOT NULL,
  `descripcion_falla` TEXT NOT NULL,
  `acciones_corregir` TEXT NULL DEFAULT NULL,
  `concesiones` TEXT NULL DEFAULT NULL,
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `idempleado` INT NOT NULL,
  `idincumplimiento` INT NOT NULL,
  PRIMARY KEY (`idsalida_noconforme`),
  INDEX `fk_formato_salidas_no_conformes_empleado1_idx` (`idempleado` ASC) VISIBLE,
  INDEX `fk_salida_noconforme_incumplimiento1_idx` (`idincumplimiento` ASC) VISIBLE,
  CONSTRAINT `fk_formato_salidas_no_conformes_empleado1`
    FOREIGN KEY (`idempleado`)
    REFERENCES `empleado` (`idempleado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_salida_noconforme_incumplimiento1`
    FOREIGN KEY (`idincumplimiento`)
    REFERENCES `incumplimiento` (`idincumplimiento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `recurso`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `recurso` ;

CREATE TABLE IF NOT EXISTS `recurso` (
  `idrecurso` INT NOT NULL AUTO_INCREMENT,
  `recurso` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idrecurso`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `monto_faltante`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `monto_faltante` ;

CREATE TABLE IF NOT EXISTS `monto_faltante` (
  `idmonto_faltante` INT NOT NULL AUTO_INCREMENT,
  `cantidad` DECIMAL(10,2) NOT NULL,
  `fecha` DATE NOT NULL,
  `idempleado` INT NOT NULL,
  PRIMARY KEY (`idmonto_faltante`),
  INDEX `fk_monto_faltante_Empleado1_idx` (`idempleado` ASC) VISIBLE,
  CONSTRAINT `fk_monto_faltante_Empleado1`
    FOREIGN KEY (`idempleado`)
    REFERENCES `empleado` (`idempleado`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `recoleccion_efectivo`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `recoleccion_efectivo` ;

CREATE TABLE IF NOT EXISTS `recoleccion_efectivo` (
  `idrecoleccion_efectivo` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATE NOT NULL,
  `idempleado` INT NOT NULL,
  `cantidad` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`idrecoleccion_efectivo`),
  INDEX `fk_recoleccion_de_efectivo_empleado1_idx` (`idempleado` ASC) VISIBLE,
  CONSTRAINT `fk_recoleccion_de_efectivo_empleado1`
    FOREIGN KEY (`idempleado`)
    REFERENCES `empleado` (`idempleado`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `recurso_despachador`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `recurso_despachador` ;

CREATE TABLE IF NOT EXISTS `recurso_despachador` (
  `idrecurso_despachador` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATE NOT NULL,
  `idempleado` INT NOT NULL,
  `idrecurso` INT NOT NULL,
  `idrecurso_minimo` INT NOT NULL,
  `evaluacion` BIT NOT NULL DEFAULT 0,
  `identificador` CHAR(34) NOT NULL,
  PRIMARY KEY (`idrecurso_despachador`),
  INDEX `fk_recursos_de_despachador_empleado1_idx` (`idempleado` ASC) VISIBLE,
  INDEX `fk_recursos_de_despachador_lista_de_recursos1_idx` (`idrecurso` ASC) VISIBLE,
  INDEX `fk_recursos_de_despachador_puntaje_minimo1_idx` (`idrecurso_minimo` ASC) VISIBLE,
  CONSTRAINT `fk_recursos_de_despachador_empleado1`
    FOREIGN KEY (`idempleado`)
    REFERENCES `empleado` (`idempleado`),
  CONSTRAINT `fk_recursos_de_despachador_lista_de_recursos1`
    FOREIGN KEY (`idrecurso`)
    REFERENCES `recurso` (`idrecurso`),
  CONSTRAINT `fk_recursos_de_despachador_puntaje_minimo1`
    FOREIGN KEY (`idrecurso_minimo`)
    REFERENCES `GasDonLalo`.`puntaje_minimo` (`idpuntaje_minimo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `user` ;

CREATE TABLE IF NOT EXISTS `user` (
  `username` VARCHAR(16) NOT NULL,
  `email` VARCHAR(255) NULL DEFAULT NULL,
  `password` VARCHAR(32) NOT NULL,
  `create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `idempleado` INT NOT NULL,
  INDEX `fk_user_empleado1_idx` (`idempleado` ASC) VISIBLE,
  CONSTRAINT `fk_user_empleado1`
    FOREIGN KEY (`idempleado`)
    REFERENCES `empleado` (`idempleado`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `turno_estacion`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `turno_estacion` ;

CREATE TABLE IF NOT EXISTS `turno_estacion` (
  `idestacion_servicio` INT NOT NULL,
  `idturno` INT NOT NULL,
  PRIMARY KEY (`idestacion_servicio`, `idturno`),
  INDEX `fk_estacion_servicio_has_turno_turno1_idx` (`idturno` ASC) VISIBLE,
  INDEX `fk_estacion_servicio_has_turno_estacion_servicio1_idx` (`idestacion_servicio` ASC) VISIBLE,
  CONSTRAINT `fk_estacion_servicio_has_turno_estacion_servicio1`
    FOREIGN KEY (`idestacion_servicio`)
    REFERENCES `estacion_servicio` (`idestacion_servicio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_estacion_servicio_has_turno_turno1`
    FOREIGN KEY (`idturno`)
    REFERENCES `GasDonLalo`.`turno` (`idturno`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
