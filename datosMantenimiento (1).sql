-- MySQL dump 10.13  Distrib 8.4.0, for Linux (x86_64)
--
-- Host: localhost    Database: gasdonlalo
-- ------------------------------------------------------
-- Server version	8.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `actividades`
--

DROP TABLE IF EXISTS `actividades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actividades` (
  `idactividad` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `periodo_actividad` enum('semanal','mensual','cuatrimestral','anual') NOT NULL,
  `observaciones` mediumtext,
  `updatedAt` datetime NOT NULL,
  `createdAt` varchar(45) NOT NULL,
  PRIMARY KEY (`idactividad`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actividades`
--

LOCK TABLES `actividades` WRITE;
/*!40000 ALTER TABLE `actividades` DISABLE KEYS */;
INSERT INTO `actividades` VALUES (8,'Limpieza zona de tanques','semanal','','2024-06-28 10:35:04','2024-06-28 10:24:24'),(10,'Limpieza de tanques de combustibles','anual','Se realizará cada 7 años.','2024-06-28 10:36:59','2024-06-28 10:30:08'),(12,'Riego de areas verdes','semanal',NULL,'2024-06-29 10:00:30','2024-06-29 10:00:30');
/*!40000 ALTER TABLE `actividades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fechas_actividades`
--

DROP TABLE IF EXISTS `fechas_actividades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fechas_actividades` (
  `idfechas_actividades` int NOT NULL AUTO_INCREMENT,
  `fecha_programada` date NOT NULL,
  `fecha_realizada` date DEFAULT NULL,
  `idactividad` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `id_ot` int DEFAULT NULL,
  PRIMARY KEY (`idfechas_actividades`),
  KEY `fk_fechas_actividades_actividades1_idx` (`idactividad`),
  KEY `fk_fechas_actividades_ordenes_trabajo1_idx` (`id_ot`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fechas_actividades`
--

LOCK TABLES `fechas_actividades` WRITE;
/*!40000 ALTER TABLE `fechas_actividades` DISABLE KEYS */;
INSERT INTO `fechas_actividades` VALUES (1,'2024-06-13',NULL,1,'2024-06-22 12:07:08','2024-06-22 12:59:25',6),(2,'2024-06-15',NULL,2,'2024-06-22 12:11:01','2024-06-22 12:11:01',NULL),(3,'2024-06-13',NULL,2,'2024-06-22 14:11:54','2024-06-22 14:11:54',NULL),(4,'2024-06-13',NULL,1,'2024-06-22 14:12:02','2024-06-22 14:12:02',NULL),(5,'2025-06-27',NULL,3,'2024-06-26 19:06:48','2024-06-26 19:06:48',NULL),(6,'2024-07-06',NULL,10,'2024-06-28 10:37:16','2024-06-28 10:43:20',7),(7,'2024-06-22',NULL,8,'2024-06-28 11:29:33','2024-06-28 11:29:33',NULL),(8,'2024-07-31',NULL,12,'2024-06-29 10:01:05','2024-06-29 10:01:05',NULL),(9,'2024-06-14',NULL,12,'2024-06-29 10:01:57','2024-06-29 10:03:17',8),(10,'2024-06-14',NULL,12,'2024-06-29 10:03:09','2024-06-29 10:03:09',NULL),(11,'2024-07-12',NULL,8,'2024-06-29 10:04:26','2024-06-29 10:04:26',NULL),(12,'2024-06-14',NULL,8,'2024-06-29 10:04:33','2024-06-29 10:04:33',NULL),(13,'2024-07-19',NULL,12,'2024-06-29 10:07:29','2024-06-29 10:07:29',NULL);
/*!40000 ALTER TABLE `fechas_actividades` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-29 10:14:29
