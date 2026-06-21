-- ============================================================
-- Cafeteria Ronroneo - SQL unificado
-- ============================================================
-- Archivo principal para instalar la base de datos completa.
-- Ejecutar este archivo en phpMyAdmin o con mysql.exe.
--
-- Incluye:
-- - Estructura completa de la base cafeteriaronroneo.
-- - Datos precargados para productos, categorias, menus, combos.
-- - Datos de Avance 3: menuproductos, estaciones y preparacion.
-- - Relaciones y llaves foraneas.
--
-- Nota: Las imagenes no se guardan dentro del SQL. Los registros
-- guardan el nombre del archivo y las imagenes deben estar en /uploads.
-- ============================================================

-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: cafeteriaronroneo
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `cafeteriaronroneo`
--

/*!40000 DROP DATABASE IF EXISTS `cafeteriaronroneo`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `cafeteriaronroneo` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `cafeteriaronroneo`;

--
-- Table structure for table `carritocombos`
--

DROP TABLE IF EXISTS `carritocombos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `carritocombos` (
  `IdCarrito` int(11) NOT NULL,
  `IdCombo` int(11) NOT NULL,
  `Cantidad` int(11) NOT NULL,
  PRIMARY KEY (`IdCarrito`,`IdCombo`),
  KEY `fk_carritocombo_combo` (`IdCombo`),
  CONSTRAINT `fk_carritocombo_carrito` FOREIGN KEY (`IdCarrito`) REFERENCES `carritos` (`IdCarrito`),
  CONSTRAINT `fk_carritocombo_combo` FOREIGN KEY (`IdCombo`) REFERENCES `combos` (`IdCombo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carritocombos`
--

LOCK TABLES `carritocombos` WRITE;
/*!40000 ALTER TABLE `carritocombos` DISABLE KEYS */;
/*!40000 ALTER TABLE `carritocombos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carritoproductos`
--

DROP TABLE IF EXISTS `carritoproductos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `carritoproductos` (
  `IdCarrito` int(11) NOT NULL,
  `IdProducto` int(11) NOT NULL,
  `Cantidad` int(11) NOT NULL,
  PRIMARY KEY (`IdCarrito`,`IdProducto`),
  KEY `fk_carritoproducto_producto` (`IdProducto`),
  CONSTRAINT `fk_carritoproducto_carrito` FOREIGN KEY (`IdCarrito`) REFERENCES `carritos` (`IdCarrito`),
  CONSTRAINT `fk_carritoproducto_producto` FOREIGN KEY (`IdProducto`) REFERENCES `productos` (`IdProducto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carritoproductos`
--

LOCK TABLES `carritoproductos` WRITE;
/*!40000 ALTER TABLE `carritoproductos` DISABLE KEYS */;
/*!40000 ALTER TABLE `carritoproductos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carritos`
--

DROP TABLE IF EXISTS `carritos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `carritos` (
  `IdCarrito` int(11) NOT NULL AUTO_INCREMENT,
  `IdCliente` int(11) NOT NULL,
  `FechaCreacion` date NOT NULL,
  `Estado` tinyint(1) NOT NULL,
  PRIMARY KEY (`IdCarrito`),
  KEY `fk_carrito_cliente` (`IdCliente`),
  CONSTRAINT `fk_carrito_cliente` FOREIGN KEY (`IdCliente`) REFERENCES `clientes` (`IdCliente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carritos`
--

LOCK TABLES `carritos` WRITE;
/*!40000 ALTER TABLE `carritos` DISABLE KEYS */;
/*!40000 ALTER TABLE `carritos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categoria` (
  `IdCategoria` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) NOT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`IdCategoria`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
INSERT INTO `categoria` VALUES (1,'Bebidas Calientes','Cafes, tes y bebidas calientes'),(2,'Bebidas Frias','Limonadas, batidos y bebidas frias'),(3,'Reposteria y Postres','Pancakes, tostadas, croissants y postres'),(4,'Bocadillos y Wraps','Sandwiches, wraps y comidas rapidas'),(5,'Platos Fuertes','Pastas, arroz, pizza, hamburguesas y platos de cocina');
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clientes` (
  `IdCliente` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) NOT NULL,
  `Telefono` varchar(20) NOT NULL,
  `Correo` varchar(150) NOT NULL,
  `Direccion` varchar(255) NOT NULL,
  `FechaRegistro` date NOT NULL,
  `IdUsuario` int(11) DEFAULT NULL,
  PRIMARY KEY (`IdCliente`),
  KEY `fk_cliente_usuario` (`IdUsuario`),
  CONSTRAINT `fk_cliente_usuario` FOREIGN KEY (`IdUsuario`) REFERENCES `usuarios` (`IdUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'Cliente Uno','8888-1111','cliente1@ronroneo.com','San José','2026-06-01',2),(2,'Cliente Dos','8888-2222','cliente2@ronroneo.com','Heredia','2026-06-01',3),(3,'Cliente Tres','8888-3333','cliente3@ronroneo.com','Alajuela','2026-06-01',4);
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comboproductos`
--

DROP TABLE IF EXISTS `comboproductos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comboproductos` (
  `IdCombo` int(11) NOT NULL,
  `IdProducto` int(11) NOT NULL,
  `Cantidad` int(11) NOT NULL,
  PRIMARY KEY (`IdCombo`,`IdProducto`),
  KEY `fk_comboproducto_producto` (`IdProducto`),
  CONSTRAINT `fk_comboproducto_combo` FOREIGN KEY (`IdCombo`) REFERENCES `combos` (`IdCombo`),
  CONSTRAINT `fk_comboproducto_producto` FOREIGN KEY (`IdProducto`) REFERENCES `productos` (`IdProducto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comboproductos`
--

LOCK TABLES `comboproductos` WRITE;
/*!40000 ALTER TABLE `comboproductos` DISABLE KEYS */;
INSERT INTO `comboproductos` VALUES (1,1,1),(1,5,1),(2,3,1),(2,4,1),(2,6,1),(3,2,1),(3,5,1),(4,7,1),(4,11,1),(5,9,1),(5,12,1),(6,10,1),(6,11,1),(6,13,1),(7,14,1),(7,19,1),(8,15,1),(8,18,1),(9,16,1),(9,19,1);
/*!40000 ALTER TABLE `comboproductos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `combos`
--

DROP TABLE IF EXISTS `combos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `combos` (
  `IdCombo` int(11) NOT NULL AUTO_INCREMENT,
  `IdMenu` int(11) NOT NULL,
  `Nombre` varchar(150) NOT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  `Precio` decimal(10,2) NOT NULL,
  `Estado` tinyint(1) NOT NULL,
  PRIMARY KEY (`IdCombo`),
  KEY `fk_combo_menu` (`IdMenu`),
  CONSTRAINT `fk_combo_menu` FOREIGN KEY (`IdMenu`) REFERENCES `menu` (`IdMenu`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `combos`
--

LOCK TABLES `combos` WRITE;
/*!40000 ALTER TABLE `combos` DISABLE KEYS */;
INSERT INTO `combos` VALUES (1,1,'Combo Gatito Dulce','Pancakes Ronroneo con miel y frutas y Cafe Latte Gatuno.',4300.00,1),(2,1,'Combo Manana Feliz','Omelette de queso y jamon, Croissant de mantequilla y Chocolate caliente con crema.',5800.00,1),(3,1,'Combo Bigotes','Tostadas francesas con fresas y Cafe Latte Gatuno.',4000.00,1),(4,2,'Combo Ronroneo Clasico','Pasta cremosa con pollo y Limonada natural.',5400.00,1),(5,2,'Combo Gatuno Ligero','Ensalada Cesar con pollo y Te frio de melocoton.',4700.00,1),(6,2,'Combo Bigotes Lunch','Sandwich Club Ronroneo, Limonada natural y Brownie de chocolate.',6200.00,1),(7,3,'Combo Noche Gatuna','Pizza artesanal de queso y Te Chai caliente.',5900.00,1),(8,3,'Combo Ronroneo Especial','Hamburguesa Ronroneo y Batido de vainilla.',5900.00,1),(9,3,'Combo Cena Suave','Crema de tomate con pan tostado y Te Chai caliente.',4600.00,1);
/*!40000 ALTER TABLE `combos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detallepedidos`
--

DROP TABLE IF EXISTS `detallepedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `detallepedidos` (
  `IdDetalle` int(11) NOT NULL AUTO_INCREMENT,
  `IdPedido` int(11) NOT NULL,
  `IdProducto` int(11) NOT NULL,
  `IdCombo` int(11) DEFAULT NULL,
  `Cantidad` int(11) NOT NULL,
  `PrecioUnitario` decimal(10,0) NOT NULL,
  `Subtotal` decimal(10,0) NOT NULL,
  PRIMARY KEY (`IdDetalle`),
  KEY `fk_detalle_pedido` (`IdPedido`),
  KEY `fk_detalle_producto` (`IdProducto`),
  KEY `fk_detalle_combo` (`IdCombo`),
  CONSTRAINT `fk_detalle_combo` FOREIGN KEY (`IdCombo`) REFERENCES `combos` (`IdCombo`),
  CONSTRAINT `fk_detalle_pedido` FOREIGN KEY (`IdPedido`) REFERENCES `pedidos` (`IdPedido`),
  CONSTRAINT `fk_detalle_producto` FOREIGN KEY (`IdProducto`) REFERENCES `productos` (`IdProducto`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detallepedidos`
--

LOCK TABLES `detallepedidos` WRITE;
/*!40000 ALTER TABLE `detallepedidos` DISABLE KEYS */;
/*!40000 ALTER TABLE `detallepedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estaciones`
--

DROP TABLE IF EXISTS `estaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `estaciones` (
  `IdEstacion` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`IdEstacion`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estaciones`
--

LOCK TABLES `estaciones` WRITE;
/*!40000 ALTER TABLE `estaciones` DISABLE KEYS */;
INSERT INTO `estaciones` VALUES (1,'Barra de cafe'),(2,'Bebidas frias'),(3,'Reposteria'),(4,'Cocina caliente'),(5,'Empaque');
/*!40000 ALTER TABLE `estaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `menu` (
  `IdMenu` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(150) NOT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  `HoraInicio` time DEFAULT NULL,
  `HoraFin` time DEFAULT NULL,
  `DiasDisponibles` varchar(100) DEFAULT NULL,
  `FechaInicio` date NOT NULL,
  `FechaFin` date NOT NULL,
  `Estado` tinyint(1) NOT NULL,
  PRIMARY KEY (`IdMenu`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` VALUES (1,'Menu Desayuno','Horario: 7:00 a. m. a 12:00 m.','07:00:00','12:00:00','Lunes a domingo','2026-01-01','2026-12-31',1),(2,'Menu Almuerzo','Horario: 1:00 p. m. a 6:00 p. m.','13:00:00','18:00:00','Lunes a domingo','2026-01-01','2026-12-31',1),(3,'Menu Cena','Horario: 7:00 p. m. a 12:00 a. m.','19:00:00','00:00:00','Lunes a domingo','2026-01-01','2026-12-31',1);
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menuproductos`
--

DROP TABLE IF EXISTS `menuproductos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `menuproductos` (
  `IdMenu` int(11) NOT NULL,
  `IdProducto` int(11) NOT NULL,
  PRIMARY KEY (`IdMenu`,`IdProducto`),
  KEY `fk_menuproducto_producto` (`IdProducto`),
  CONSTRAINT `fk_menuproducto_menu` FOREIGN KEY (`IdMenu`) REFERENCES `menu` (`IdMenu`),
  CONSTRAINT `fk_menuproducto_producto` FOREIGN KEY (`IdProducto`) REFERENCES `productos` (`IdProducto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menuproductos`
--

LOCK TABLES `menuproductos` WRITE;
/*!40000 ALTER TABLE `menuproductos` DISABLE KEYS */;
INSERT INTO `menuproductos` VALUES (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(2,7),(2,8),(2,9),(2,10),(2,11),(2,12),(2,13),(3,14),(3,15),(3,16),(3,17),(3,18),(3,19);
/*!40000 ALTER TABLE `menuproductos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagos`
--

DROP TABLE IF EXISTS `pagos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pagos` (
  `IdPago` int(11) NOT NULL AUTO_INCREMENT,
  `IdPedido` int(11) NOT NULL,
  `MetodoPago` varchar(50) NOT NULL,
  `Monto` decimal(10,0) NOT NULL,
  `FechaPago` date NOT NULL,
  `Estado` tinyint(1) NOT NULL,
  PRIMARY KEY (`IdPago`),
  KEY `fk_pago_pedido` (`IdPedido`),
  CONSTRAINT `fk_pago_pedido` FOREIGN KEY (`IdPedido`) REFERENCES `pedidos` (`IdPedido`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagos`
--

LOCK TABLES `pagos` WRITE;
/*!40000 ALTER TABLE `pagos` DISABLE KEYS */;
INSERT INTO `pagos` VALUES (1,1,'Efectivo',3800,'2026-06-10',1),(2,2,'Tarjeta',4200,'2026-06-11',1);
/*!40000 ALTER TABLE `pagos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pedidos` (
  `IdPedido` int(11) NOT NULL AUTO_INCREMENT,
  `IdCliente` int(11) NOT NULL,
  `IdUsuario` int(11) NOT NULL,
  `IdCarrito` int(11) DEFAULT NULL,
  `FechaPedido` date NOT NULL,
  `Estado` tinyint(1) NOT NULL,
  `Total` decimal(10,0) NOT NULL,
  PRIMARY KEY (`IdPedido`),
  KEY `fk_pedido_cliente` (`IdCliente`),
  KEY `fk_pedido_usuario` (`IdUsuario`),
  KEY `fk_pedido_carrito` (`IdCarrito`),
  CONSTRAINT `fk_pedido_carrito` FOREIGN KEY (`IdCarrito`) REFERENCES `carritos` (`IdCarrito`),
  CONSTRAINT `fk_pedido_cliente` FOREIGN KEY (`IdCliente`) REFERENCES `clientes` (`IdCliente`),
  CONSTRAINT `fk_pedido_usuario` FOREIGN KEY (`IdUsuario`) REFERENCES `usuarios` (`IdUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
INSERT INTO `pedidos` VALUES (1,1,1,NULL,'2026-06-10',1,3800),(2,2,1,NULL,'2026-06-11',1,4200),(3,3,1,NULL,'2026-06-12',0,5500);
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preparacion`
--

DROP TABLE IF EXISTS `preparacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `preparacion` (
  `IdPreparacion` int(11) NOT NULL AUTO_INCREMENT,
  `IdPedido` int(11) NOT NULL,
  `Estado` tinyint(1) NOT NULL,
  `HoraInicio` time DEFAULT NULL,
  `HoraFin` time DEFAULT NULL,
  `Observaciones` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`IdPreparacion`),
  KEY `fk_preparacion_pedido` (`IdPedido`),
  CONSTRAINT `fk_preparacion_pedido` FOREIGN KEY (`IdPedido`) REFERENCES `pedidos` (`IdPedido`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preparacion`
--

LOCK TABLES `preparacion` WRITE;
/*!40000 ALTER TABLE `preparacion` DISABLE KEYS */;
INSERT INTO `preparacion` VALUES (1,1,1,'08:00:00','08:10:00','Preparación de Cappuccino y Croissant'),(2,2,1,'10:30:00','10:40:00','Preparación de Cheesecake y Limonada'),(3,3,0,'12:00:00',NULL,'Pendiente: Batido y Wrap en preparación');
/*!40000 ALTER TABLE `preparacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productopreparacion`
--

DROP TABLE IF EXISTS `productopreparacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `productopreparacion` (
  `IdProducto` int(11) NOT NULL,
  `IdEstacion` int(11) NOT NULL,
  `Orden` int(11) NOT NULL,
  PRIMARY KEY (`IdProducto`,`IdEstacion`),
  KEY `fk_productopreparacion_estacion` (`IdEstacion`),
  CONSTRAINT `fk_productopreparacion_estacion` FOREIGN KEY (`IdEstacion`) REFERENCES `estaciones` (`IdEstacion`),
  CONSTRAINT `fk_productopreparacion_producto` FOREIGN KEY (`IdProducto`) REFERENCES `productos` (`IdProducto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productopreparacion`
--

LOCK TABLES `productopreparacion` WRITE;
/*!40000 ALTER TABLE `productopreparacion` DISABLE KEYS */;
INSERT INTO `productopreparacion` VALUES (1,3,2),(1,4,1),(1,5,3),(2,3,2),(2,4,1),(2,5,3),(3,4,1),(3,5,2),(4,3,1),(5,1,1),(5,5,2),(6,1,1),(6,5,2),(7,4,1),(7,5,2),(8,4,1),(8,5,2),(9,4,1),(9,5,2),(10,4,1),(10,5,2),(11,2,1),(11,5,2),(12,2,1),(12,5,2),(13,3,1),(14,4,1),(14,5,2),(15,4,1),(15,5,2),(16,4,1),(16,5,2),(17,4,1),(17,5,2),(18,2,1),(18,5,2),(19,1,1),(19,5,2);
/*!40000 ALTER TABLE `productopreparacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `productos` (
  `IdProducto` int(11) NOT NULL AUTO_INCREMENT,
  `IdCategoria` int(11) NOT NULL,
  `Nombre` varchar(150) NOT NULL,
  `Descripcion` text DEFAULT NULL,
  `ingredientes` varchar(255) NOT NULL,
  `Imagen` varchar(255) DEFAULT NULL,
  `Precio` decimal(10,0) NOT NULL,
  `Estado` tinyint(1) NOT NULL,
  PRIMARY KEY (`IdProducto`),
  KEY `fk_producto_categoria` (`IdCategoria`),
  CONSTRAINT `fk_producto_categoria` FOREIGN KEY (`IdCategoria`) REFERENCES `categoria` (`IdCategoria`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,3,'Pancakes Ronroneo con miel y frutas','Pancakes suaves servidos con miel y frutas frescas.','Harina, leche, huevo, miel, frutas','d-pancakesRonroneoMielFrutas.webp',2800,1),(2,3,'Tostadas francesas con fresas','Tostadas doradas con fresas frescas y toque dulce.','Pan, huevo, leche, canela, fresas','d-TostadasFrancesasFresas.jpg',2600,1),(3,4,'Omelette de queso y jamon','Omelette caliente con queso fundido y jamon.','Huevo, queso, jamon, sal, pimienta','d-omeletteJamonQueso.webp',3000,1),(4,3,'Croissant de mantequilla','Croissant dorado y crujiente de mantequilla.','Harina, mantequilla, levadura, sal','d-croissantMantequilla.jpg',1600,1),(5,1,'Cafe Latte Gatuno','Cafe latte cremoso preparado en barra.','Cafe, leche, espuma de leche','d-CafeLatteGatuno.jpg',1800,1),(6,1,'Chocolate caliente con crema','Chocolate caliente espeso con crema.','Chocolate, leche, crema batida','d-ChocolateCalienteConCrema.webp',1700,1),(7,5,'Pasta cremosa con pollo','Pasta en salsa cremosa con pollo.','Pasta, pollo, crema, queso, especias','a-Pasta cremosa con pollo.jpg',4500,1),(8,5,'Arroz con pollo especial','Arroz con pollo preparado al estilo Ronroneo.','Arroz, pollo, vegetales, especias','a-ArrozConPolloEspecial.jpg',4200,1),(9,5,'Ensalada Cesar con pollo','Ensalada Cesar fresca con pollo.','Lechuga, pollo, crutones, queso, aderezo Cesar','a-ensaladaCesarConPollo.jpg',3800,1),(10,4,'Sandwich Club Ronroneo','Sandwich club con pan tostado y relleno completo.','Pan, pollo, jamon, queso, lechuga, tomate','a-sandwichClubRonroneo.jpg',3900,1),(11,2,'Limonada natural','Limonada fria preparada con limon natural.','Limon, agua, azucar, hielo','a-limonadaNatural.jpg',1300,1),(12,2,'Te frio de melocoton','Te frio con sabor a melocoton.','Te, melocoton, agua, hielo','a-teFrioMelocoton.jpg',1400,1),(13,3,'Brownie de chocolate','Brownie dulce de chocolate para acompanar combos.','Chocolate, harina, huevo, mantequilla','cheesecake.jpg',1700,1),(14,5,'Pizza artesanal de queso','Pizza artesanal con queso fundido.','Masa, salsa de tomate, queso, oregano','c-pizzaArtesanalQueso.webp',4800,1),(15,5,'Hamburguesa Ronroneo','Hamburguesa de la casa con pan artesanal.','Pan, carne, queso, lechuga, tomate, salsa','c-hamburguesaRonroneo.jpg',4600,1),(16,5,'Crema de tomate con pan tostado','Crema caliente de tomate acompanada con pan tostado.','Tomate, crema, especias, pan','c-cremaDeTomateConPanTostado.jpg',3200,1),(17,4,'Wrap de pollo y vegetales','Wrap relleno de pollo y vegetales frescos.','Tortilla, pollo, lechuga, tomate, vegetales','c-wrapDePolloYVegetales.webp',3600,1),(18,2,'Batido de vainilla','Batido frio de vainilla.','Leche, vainilla, hielo, azucar','c-batidoVainilla.jpg',1800,1),(19,1,'Te Chai caliente','Te chai caliente con especias.','Te chai, leche, canela, especias','c-teChaiCaliente.avif',1700,1),(21,5,'Lasaña Gatuna','Lasaña gatuna echa con amor de gatos','Carne,Queso,Pasta,Salsa de tomate','producto_20260621_073425_6a3777e10cbe3_lasa__a.png',4200,1);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rol` (
  `IdRol` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(75) NOT NULL,
  PRIMARY KEY (`IdRol`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,'Administrador'),(2,'Cliente');
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `IdUsuario` int(11) NOT NULL AUTO_INCREMENT,
  `IdRol` int(11) DEFAULT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Apellido` varchar(100) NOT NULL,
  `Correo` varchar(150) NOT NULL,
  `Contrasena` varchar(255) NOT NULL,
  `Estado` tinyint(1) NOT NULL,
  PRIMARY KEY (`IdUsuario`),
  KEY `fk_rol_usuarios` (`IdRol`),
  CONSTRAINT `fk_rol_usuarios` FOREIGN KEY (`IdRol`) REFERENCES `rol` (`IdRol`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,1,'Admin','Ronroneo','admin@ronroneo.com','123456',1),(2,2,'Cliente','Uno','cliente1@ronroneo.com','123456',1),(3,2,'Cliente','Dos','cliente2@ronroneo.com','123456',1),(4,2,'Cliente','Tres','cliente3@ronroneo.com','123456',1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'cafeteriaronroneo'
--

--
-- Dumping routines for database 'cafeteriaronroneo'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-20 23:40:58
