-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-08-2026 a las 07:12:28
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `cafeteriaronroneo`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carritocombos`
--

CREATE TABLE `carritocombos` (
  `IdCarrito` int(11) NOT NULL,
  `IdCombo` int(11) NOT NULL,
  `Cantidad` int(11) NOT NULL,
  `Observaciones` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carritocombos`
--

INSERT INTO `carritocombos` (`IdCarrito`, `IdCombo`, `Cantidad`, `Observaciones`) VALUES
(4, 12, 1, NULL),
(5, 9, 1, NULL),
(7, 3, 1, NULL),
(9, 8, 1, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carritoproductos`
--

CREATE TABLE `carritoproductos` (
  `IdCarrito` int(11) NOT NULL,
  `IdProducto` int(11) NOT NULL,
  `Cantidad` int(11) NOT NULL,
  `Observaciones` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carritoproductos`
--

INSERT INTO `carritoproductos` (`IdCarrito`, `IdProducto`, `Cantidad`, `Observaciones`) VALUES
(3, 21, 1, NULL),
(6, 15, 1, NULL),
(8, 3, 2, NULL),
(10, 21, 1, ''),
(11, 21, 1, ''),
(12, 15, 1, ''),
(13, 15, 2, ''),
(14, 3, 1, ''),
(14, 14, 1, ''),
(14, 15, 1, 'no tenga lechuga'),
(15, 15, 1, ''),
(16, 21, 1, ''),
(17, 14, 1, ''),
(17, 15, 1, 'Sin lechuga'),
(18, 21, 1, ''),
(19, 15, 1, 'Sin lechuga'),
(19, 21, 2, ''),
(20, 16, 1, ''),
(21, 9, 1, ''),
(22, 8, 1, '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carritos`
--

CREATE TABLE `carritos` (
  `IdCarrito` int(11) NOT NULL,
  `IdCliente` int(11) NOT NULL,
  `FechaCreacion` date NOT NULL,
  `Estado` tinyint(1) NOT NULL,
  `EstadoSolicitud` varchar(20) NOT NULL DEFAULT 'Borrador',
  `FechaEnvio` datetime DEFAULT NULL,
  `IdEncargado` int(11) DEFAULT NULL,
  `FechaAtencion` datetime DEFAULT NULL,
  `MetodoEntrega` varchar(30) NOT NULL DEFAULT 'Recogida en tienda',
  `DireccionEntrega` varchar(255) DEFAULT NULL,
  `CostoEnvio` decimal(10,0) NOT NULL DEFAULT 0,
  `MetodoPago` varchar(20) NOT NULL DEFAULT 'Efectivo',
  `MontoRecibido` decimal(10,0) DEFAULT NULL,
  `TarjetaUltimos4` varchar(4) DEFAULT NULL,
  `PagoConfirmado` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carritos`
--

INSERT INTO `carritos` (`IdCarrito`, `IdCliente`, `FechaCreacion`, `Estado`, `EstadoSolicitud`, `FechaEnvio`, `IdEncargado`, `FechaAtencion`, `MetodoEntrega`, `DireccionEntrega`, `CostoEnvio`, `MetodoPago`, `MontoRecibido`, `TarjetaUltimos4`, `PagoConfirmado`) VALUES
(3, 6, '2026-07-19', 1, 'Procesado', NULL, 8, '2026-08-10 18:38:30', 'Recogida en tienda', NULL, 0, 'Efectivo', NULL, NULL, 0),
(4, 7, '2026-08-06', 1, 'Procesado', NULL, 8, '2026-08-10 18:38:30', 'Recogida en tienda', NULL, 0, 'Efectivo', NULL, NULL, 0),
(5, 7, '2026-08-10', 1, 'Procesado', NULL, 8, '2026-08-10 18:38:30', 'Recogida en tienda', NULL, 0, 'Efectivo', NULL, NULL, 0),
(6, 7, '2026-08-10', 1, 'Procesado', NULL, 8, '2026-08-10 18:38:30', 'Recogida en tienda', NULL, 0, 'Efectivo', NULL, NULL, 0),
(7, 7, '2026-08-10', 1, 'Procesado', NULL, 8, '2026-08-10 18:38:30', 'Recogida en tienda', NULL, 0, 'Efectivo', NULL, NULL, 0),
(8, 7, '2026-08-10', 1, 'Procesado', '2026-08-10 18:43:54', 10, '2026-08-10 18:54:37', 'Recogida en tienda', NULL, 0, 'Efectivo', NULL, NULL, 0),
(9, 7, '2026-08-10', 1, 'Procesado', '2026-08-10 19:02:31', 10, '2026-08-10 19:10:05', 'Entrega a domicilio', 'San Jose Desamparados', 1500, 'Efectivo', NULL, NULL, 0),
(10, 7, '2026-08-10', 1, 'Procesado', '2026-08-10 19:44:26', 9, '2026-08-10 19:51:27', 'Entrega a domicilio', 'San Pablo Heredia', 1500, 'Tarjeta', NULL, '2369', 1),
(11, 7, '2026-08-10', 1, 'Procesado', '2026-08-10 19:57:42', 9, '2026-08-10 19:58:44', 'Entrega a domicilio', 'Desamparados Alajuela', 1500, 'Efectivo', 6500, NULL, 0),
(12, 7, '2026-08-10', 1, 'Procesado', '2026-08-10 20:28:24', 9, '2026-08-10 20:30:04', 'Entrega a domicilio', 'desampa', 1500, 'Efectivo', 7000, NULL, 0),
(13, 7, '2026-08-10', 1, 'Procesado', '2026-08-10 20:42:13', 9, '2026-08-10 20:42:44', 'Entrega a domicilio', 'San pablo', 1500, 'Efectivo', 12000, NULL, 0),
(14, 7, '2026-08-10', 1, 'Procesado', '2026-08-10 21:08:50', 9, '2026-08-10 21:10:33', 'Recogida en tienda', '', 0, 'Efectivo', NULL, NULL, 0),
(15, 7, '2026-08-10', 1, 'Procesado', '2026-08-10 21:15:47', 13, '2026-08-10 21:16:39', 'Entrega a domicilio', 'San Pablo de Heredia', 1500, 'Tarjeta', NULL, '1234', 1),
(16, 7, '2026-08-10', 1, 'Procesado', '2026-08-10 21:17:02', 13, '2026-08-10 21:17:43', 'Recogida en tienda', '', 0, 'Tarjeta', NULL, NULL, 0),
(17, 7, '2026-08-10', 1, 'Procesado', '2026-08-10 21:28:40', 9, '2026-08-10 21:29:39', 'Entrega a domicilio', 'Heredia Santo Domingo', 1500, 'Efectivo', 16000, NULL, 0),
(18, 7, '2026-08-10', 1, 'Procesado', '2026-08-10 21:33:48', 9, '2026-08-10 21:35:03', 'Recogida en tienda', '', 0, 'Tarjeta', NULL, NULL, 0),
(19, 7, '2026-08-11', 1, 'Procesado', NULL, 9, '2026-08-11 18:30:59', 'Recogida en tienda', NULL, 0, 'Efectivo', NULL, NULL, 0),
(20, 7, '2026-08-11', 1, 'Procesado', '2026-08-11 18:37:14', 9, '2026-08-11 18:38:00', 'Entrega a domicilio', 'San jose', 1500, 'Tarjeta', NULL, '2764', 1),
(21, 7, '2026-08-16', 1, 'Procesado', NULL, 14, '2026-08-16 23:06:31', 'Recogida en tienda', NULL, 0, 'Efectivo', NULL, NULL, 0),
(22, 7, '2026-08-16', 1, 'Procesado', '2026-08-16 23:09:39', 14, '2026-08-16 23:10:07', 'Recogida en tienda', '', 0, 'Efectivo', NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `IdCategoria` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`IdCategoria`, `Nombre`, `Descripcion`) VALUES
(1, 'Bebidas Calientes', 'Cafes, tes y bebidas calientes'),
(2, 'Bebidas Frias', 'Limonadas, batidos y bebidas frias'),
(3, 'Reposteria y Postres', 'Pancakes, tostadas, croissants y postres'),
(4, 'Bocadillos y Wraps', 'Sandwiches, wraps y comidas rapidas'),
(5, 'Platos Fuertes', 'Pastas, arroz, pizza, hamburguesas y platos de cocina');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `IdCliente` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Telefono` varchar(20) NOT NULL,
  `Correo` varchar(150) NOT NULL,
  `Direccion` varchar(255) NOT NULL,
  `FechaRegistro` date NOT NULL,
  `IdUsuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`IdCliente`, `Nombre`, `Telefono`, `Correo`, `Direccion`, `FechaRegistro`, `IdUsuario`) VALUES
(6, 'Admin Ronroneo', '90651278', 'admin@ronroneo.com', 'Heredia', '2026-07-19', 6),
(7, 'Gabriel Leiton', '60582347', 'gaboleitona@gmail.com', 'Villas de la quintana, san pablo, heredia', '2026-08-06', 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comboproductos`
--

CREATE TABLE `comboproductos` (
  `IdCombo` int(11) NOT NULL,
  `IdProducto` int(11) NOT NULL,
  `Cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `comboproductos`
--

INSERT INTO `comboproductos` (`IdCombo`, `IdProducto`, `Cantidad`) VALUES
(1, 1, 1),
(1, 5, 1),
(2, 3, 1),
(2, 4, 1),
(2, 6, 1),
(3, 2, 1),
(3, 5, 1),
(4, 7, 1),
(4, 11, 1),
(5, 9, 1),
(5, 12, 1),
(6, 10, 1),
(6, 11, 1),
(6, 13, 1),
(7, 14, 1),
(7, 19, 1),
(8, 15, 1),
(8, 18, 1),
(9, 16, 1),
(9, 19, 1),
(11, 5, 2),
(11, 22, 1),
(12, 5, 2),
(12, 17, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `combos`
--

CREATE TABLE `combos` (
  `IdCombo` int(11) NOT NULL,
  `IdMenu` int(11) NOT NULL,
  `Nombre` varchar(150) NOT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  `Imagen` varchar(255) DEFAULT NULL,
  `Precio` decimal(10,2) NOT NULL,
  `Estado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `combos`
--

INSERT INTO `combos` (`IdCombo`, `IdMenu`, `Nombre`, `Descripcion`, `Imagen`, `Precio`, `Estado`) VALUES
(1, 1, 'Combo Gatito Dulce', 'Pancakes Ronroneo con miel y frutas y Cafe Latte Gatuno.', 'Combo1.jpg', 4300.00, 1),
(2, 1, 'Combo Manana Feliz', 'Omelette de queso y jamon, Croissant de mantequilla y Chocolate caliente con crema.', 'Combo2.jpg', 5800.00, 1),
(3, 1, 'Combo Bigotes', 'Tostadas francesas con fresas y Cafe Latte Gatuno.', 'Combo3.jpg', 4000.00, 1),
(4, 2, 'Combo Ronroneo Clasico', 'Pasta cremosa con pollo y Limonada natural.', 'Combo1.jpg', 5400.00, 1),
(5, 2, 'Combo Gatuno Ligero', 'Ensalada Cesar con pollo y Te frio de melocoton.', 'Combo2.jpg', 4700.00, 1),
(6, 5, 'Combo Bigotes Lunch', 'Sandwich Club Ronroneo, Limonada natural y Brownie de chocolate.', 'Combo3.jpg', 6200.00, 1),
(7, 5, 'Combo Noche Gatuna', 'Pizza artesanal de queso y Te Chai caliente.', 'Combo1.jpg', 5900.00, 1),
(8, 3, 'Combo Ronroneo Especial', 'Hamburguesa Ronroneo y Batido de vainilla.', 'Combo2.jpg', 5900.00, 1),
(9, 3, 'Combo Cena Suave', 'Crema de tomate con pan tostado y Te Chai caliente.', 'Combo3.jpg', 4600.00, 1),
(11, 2, 'Combo Delicia', 'Combo conformado por Brownie con helado y un café', 'combo_20260721_052655_6a5ee6ff49d64_Brownie-Ronroneo.png', 4500.00, 1),
(12, 5, 'Combo Maravilla', 'Combo que incluye un wrap de pollo y vegetales y dos cafés', 'combo_20260721_053644_6a5ee94cb3f55_Combo-Gatito-Dulce.png', 4000.00, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detallepedidoestacion`
--

CREATE TABLE `detallepedidoestacion` (
  `IdDetalleEstacion` int(11) NOT NULL,
  `IdDetalle` int(11) NOT NULL,
  `IdEstacion` int(11) NOT NULL,
  `Estado` varchar(20) NOT NULL DEFAULT 'Cola',
  `Orden` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detallepedidoestacion`
--

INSERT INTO `detallepedidoestacion` (`IdDetalleEstacion`, `IdDetalle`, `IdEstacion`, `Estado`, `Orden`) VALUES
(1, 8, 4, 'Completado', 1),
(2, 9, 1, 'Completado', 1),
(3, 9, 5, 'Completado', 1),
(4, 10, 5, 'Completado', 1),
(5, 10, 1, 'Completado', 2),
(6, 10, 5, 'Completado', 1),
(7, 10, 4, 'Completado', 2),
(8, 11, 5, 'Completado', 2),
(9, 11, 4, 'Completado', 1),
(10, 12, 5, 'Completado', 3),
(11, 12, 5, 'Completado', 2),
(12, 12, 3, 'Completado', 2),
(13, 12, 1, 'Completado', 1),
(14, 12, 4, 'Completado', 1),
(15, 13, 5, 'Completado', 2),
(16, 13, 4, 'Completado', 1),
(17, 14, 5, 'Completado', 2),
(18, 14, 2, 'Completado', 1),
(19, 14, 4, 'Completado', 1),
(20, 15, 5, 'Completado', 2),
(21, 15, 4, 'Completado', 1),
(22, 16, 5, 'Completado', 2),
(23, 16, 4, 'Completado', 1),
(24, 17, 5, 'Completado', 2),
(25, 17, 4, 'Completado', 1),
(26, 18, 5, 'Completado', 2),
(27, 18, 4, 'Completado', 1),
(28, 19, 5, 'Completado', 2),
(29, 19, 4, 'Completado', 1),
(30, 20, 5, 'Completado', 2),
(31, 20, 4, 'Completado', 1),
(32, 21, 5, 'Completado', 2),
(33, 21, 4, 'Completado', 1),
(34, 22, 5, 'Completado', 2),
(35, 22, 4, 'Completado', 1),
(36, 23, 5, 'Completado', 2),
(37, 23, 4, 'Completado', 1),
(38, 24, 5, 'Completado', 2),
(39, 24, 4, 'Completado', 1),
(40, 25, 5, 'Completado', 2),
(41, 25, 4, 'Completado', 1),
(42, 26, 5, 'Completado', 2),
(43, 26, 4, 'Completado', 1),
(44, 27, 5, 'Completado', 2),
(45, 27, 4, 'Completado', 1),
(46, 28, 5, 'Completado', 2),
(47, 28, 4, 'Completado', 1),
(48, 29, 5, 'Completado', 2),
(49, 29, 4, 'Completado', 1),
(50, 30, 5, 'Completado', 2),
(51, 30, 4, 'Completado', 1),
(52, 31, 5, 'Cola', 2),
(53, 31, 4, 'Cola', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detallepedidos`
--

CREATE TABLE `detallepedidos` (
  `IdDetalle` int(11) NOT NULL,
  `IdPedido` int(11) NOT NULL,
  `IdProducto` int(11) DEFAULT NULL,
  `IdCombo` int(11) DEFAULT NULL,
  `Cantidad` int(11) NOT NULL,
  `PrecioUnitario` decimal(10,0) NOT NULL,
  `Subtotal` decimal(10,0) NOT NULL,
  `Impuesto` decimal(10,0) NOT NULL DEFAULT 0,
  `Observaciones` varchar(255) DEFAULT NULL,
  `IdEstacion` int(11) DEFAULT NULL,
  `Completado` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detallepedidos`
--

INSERT INTO `detallepedidos` (`IdDetalle`, `IdPedido`, `IdProducto`, `IdCombo`, `Cantidad`, `PrecioUnitario`, `Subtotal`, `Impuesto`, `Observaciones`, `IdEstacion`, `Completado`) VALUES
(8, 7, 21, NULL, 1, 4200, 4200, 0, 'Se retrasa por falta de salsa', NULL, 0),
(9, 8, NULL, 12, 1, 4000, 4000, 520, 'El cliente lo pidio con poca leche', NULL, 0),
(10, 9, NULL, 9, 1, 4600, 4600, 598, 'el pan debe ser integral', NULL, 0),
(11, 10, 15, NULL, 1, 4600, 4600, 598, 'Sin lechuga', NULL, 0),
(12, 11, NULL, 3, 1, 4000, 4000, 520, 'El cafe con leche deslactosada\nSe verá atrasado debido a la falta de leche', NULL, 0),
(13, 12, 3, NULL, 2, 3000, 6000, 780, 'Sin especias', NULL, 0),
(14, 13, NULL, 8, 1, 5900, 5900, 765, 'sin especias', NULL, 0),
(15, 14, 21, NULL, 1, 4200, 4200, 545, '', NULL, 0),
(16, 15, 21, NULL, 1, 4200, 4200, 545, '', NULL, 0),
(17, 16, 15, NULL, 1, 4600, 4600, 600, '', NULL, 0),
(18, 17, 15, NULL, 2, 4600, 9200, 1195, '', NULL, 0),
(19, 18, 15, NULL, 1, 4600, 4600, 600, 'no tenga lechuga', NULL, 0),
(20, 18, 14, NULL, 1, 4800, 4800, 625, 'se va a retrasar por falta de masa', NULL, 0),
(21, 18, 3, NULL, 1, 3000, 3000, 390, '', NULL, 0),
(22, 19, 15, NULL, 1, 4600, 4600, 600, '', NULL, 0),
(23, 20, 21, NULL, 1, 4200, 4200, 545, '', NULL, 0),
(24, 21, 15, NULL, 1, 4600, 4600, 600, 'Sin lechuga', NULL, 0),
(25, 21, 14, NULL, 1, 4800, 4800, 625, '', NULL, 0),
(26, 22, 21, NULL, 1, 4200, 4200, 545, '', NULL, 0),
(27, 23, 15, NULL, 1, 4600, 4600, 600, 'Sin lechuga', NULL, 0),
(28, 23, 21, NULL, 2, 4200, 8400, 1090, '', NULL, 0),
(29, 24, 16, NULL, 1, 3200, 3200, 415, '', NULL, 0),
(30, 25, 9, NULL, 1, 3800, 3800, 495, '', NULL, 0),
(31, 26, 8, NULL, 1, 4200, 4200, 545, '', NULL, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estaciones`
--

CREATE TABLE `estaciones` (
  `IdEstacion` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estaciones`
--

INSERT INTO `estaciones` (`IdEstacion`, `Nombre`) VALUES
(1, 'Barra de cafe'),
(2, 'Bebidas frias'),
(3, 'Reposteria'),
(4, 'Cocina caliente'),
(5, 'Empaque');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ingredientes`
--

CREATE TABLE `ingredientes` (
  `IdIngrediente` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ingredientes`
--

INSERT INTO `ingredientes` (`IdIngrediente`, `Nombre`) VALUES
(27, 'Aderezo César'),
(30, 'Agua'),
(23, 'Arroz'),
(31, 'Azúcar'),
(15, 'Café'),
(7, 'Canela'),
(41, 'Carne'),
(17, 'Chocolate'),
(21, 'Crema'),
(18, 'Crema batida'),
(36, 'Crema de leche'),
(26, 'Crutones'),
(22, 'Especias'),
(16, 'Espuma de leche'),
(8, 'Fresas'),
(5, 'Frutas'),
(37, 'Galletas'),
(1, 'Harina'),
(45, 'Helado de vainilla'),
(32, 'Hielo'),
(3, 'Huevo'),
(10, 'Jamón'),
(47, 'Jarabe de canela'),
(48, 'Jarabe de chocolate'),
(49, 'Jarabe de vainilla'),
(2, 'Leche'),
(35, 'Leche condensada'),
(25, 'Lechuga'),
(14, 'Levadura'),
(29, 'Limón'),
(13, 'Mantequilla'),
(38, 'Masa'),
(34, 'Melocotón'),
(4, 'Miel'),
(40, 'Orégano'),
(6, 'Pan'),
(19, 'Pasta'),
(12, 'Pimienta'),
(20, 'Pollo'),
(9, 'Queso'),
(11, 'Sal'),
(42, 'Salsa'),
(39, 'Salsa de tomate'),
(33, 'Té'),
(46, 'Té chai'),
(28, 'Tomate'),
(43, 'Tortilla'),
(44, 'Vainilla'),
(24, 'Vegetales');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `menu`
--

CREATE TABLE `menu` (
  `IdMenu` int(11) NOT NULL,
  `Nombre` varchar(150) NOT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  `HoraInicio` time DEFAULT NULL,
  `HoraFin` time DEFAULT NULL,
  `DiasDisponibles` varchar(100) DEFAULT NULL,
  `Imagen` varchar(255) DEFAULT NULL,
  `FechaInicio` date NOT NULL,
  `FechaFin` date NOT NULL,
  `Estado` tinyint(1) NOT NULL,
  `EnCurso` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `menu`
--

INSERT INTO `menu` (`IdMenu`, `Nombre`, `Descripcion`, `HoraInicio`, `HoraFin`, `DiasDisponibles`, `Imagen`, `FechaInicio`, `FechaFin`, `Estado`, `EnCurso`) VALUES
(1, 'Menú Desayuno', 'Horario: 7:00 a. m. a 12:00 m.', '07:00:00', '12:00:00', 'Lunes a Domingo', 'menu1.jpg', '2026-01-01', '2026-12-31', 1, 0),
(2, 'Menú Almuerzo', 'Horario: 1:00 p. m. a 6:00 p. m.', '13:00:00', '18:00:00', 'Lunes a Domingo', 'menu2.jpg', '2026-01-01', '2026-12-31', 1, 0),
(3, 'Menú Cena', 'Horario: 7:00 p. m. a 12:00 a. m.', '19:00:00', '00:00:00', 'Lunes a Domingo', 'Menu3.jpg', '2026-01-01', '2026-12-31', 1, 0),
(5, 'Menú navideño', 'Menú solo disponible durante navidad', '08:00:00', '20:00:00', 'Lunes a viernes', 'menu_20260721_053911_6a5ee9df057c9_Menu_navidad.png', '2026-12-01', '2026-12-31', 1, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `menuproductos`
--

CREATE TABLE `menuproductos` (
  `IdMenu` int(11) NOT NULL,
  `IdProducto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `menuproductos`
--

INSERT INTO `menuproductos` (`IdMenu`, `IdProducto`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(2, 7),
(2, 8),
(2, 9),
(2, 10),
(2, 11),
(2, 12),
(2, 13),
(3, 14),
(3, 15),
(3, 16),
(3, 17),
(3, 18),
(3, 19),
(5, 9),
(5, 16),
(5, 21);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `IdPago` int(11) NOT NULL,
  `IdPedido` int(11) NOT NULL,
  `MetodoPago` varchar(50) NOT NULL,
  `Monto` decimal(10,0) NOT NULL,
  `FechaPago` date NOT NULL,
  `Estado` tinyint(1) NOT NULL,
  `MontoRecibido` decimal(10,0) DEFAULT NULL,
  `Vuelto` decimal(10,0) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pagos`
--

INSERT INTO `pagos` (`IdPago`, `IdPedido`, `MetodoPago`, `Monto`, `FechaPago`, `Estado`, `MontoRecibido`, `Vuelto`) VALUES
(6, 7, 'Efectivo', 4200, '2026-07-19', 1, NULL, NULL),
(7, 8, 'Efectivo', 4520, '2026-08-06', 1, NULL, NULL),
(8, 9, 'Efectivo', 6698, '2026-08-10', 1, 7000, 302),
(9, 10, 'Tarjeta', 5198, '2026-08-10', 1, NULL, NULL),
(10, 11, 'Efectivo', 4520, '2026-08-10', 1, 5004, 484),
(11, 12, 'Efectivo', 6780, '2026-08-10', 1, 7000, 220),
(12, 13, 'Efectivo', 8165, '2026-08-10', 1, 8400, 235),
(13, 14, 'Tarjeta', 6245, '2026-08-10', 1, NULL, NULL),
(14, 15, 'Efectivo', 6245, '2026-08-10', 1, 6500, 255),
(15, 16, 'Efectivo', 6700, '2026-08-10', 1, 7000, 300),
(16, 17, 'Efectivo', 11895, '2026-08-10', 1, 12000, 105),
(17, 18, 'Efectivo', 14015, '2026-08-10', 1, 15000, 985),
(18, 19, 'Tarjeta', 6700, '2026-08-10', 1, NULL, NULL),
(19, 20, 'Tarjeta', 4745, '2026-08-10', 1, NULL, NULL),
(20, 21, 'Efectivo', 12125, '2026-08-10', 1, 13000, 875),
(21, 22, 'Tarjeta', 4745, '2026-08-10', 1, NULL, NULL),
(22, 23, 'Efectivo', 16190, '2026-08-11', 1, 16500, 310),
(23, 24, 'Tarjeta', 5115, '2026-08-11', 1, NULL, NULL),
(24, 25, 'Efectivo', 4295, '2026-08-16', 1, 4300, 5),
(25, 26, 'Efectivo', 4745, '2026-08-16', 1, 5000, 255);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `IdPedido` int(11) NOT NULL,
  `IdCliente` int(11) NOT NULL,
  `IdUsuario` int(11) NOT NULL,
  `IdCarrito` int(11) DEFAULT NULL,
  `FechaPedido` date NOT NULL,
  `Estado` varchar(30) NOT NULL DEFAULT 'Pendiente de pago',
  `Total` decimal(10,0) NOT NULL,
  `MetodoEntrega` varchar(30) NOT NULL DEFAULT 'Recogida en tienda',
  `DireccionEntrega` varchar(255) DEFAULT NULL,
  `CostoEnvio` decimal(10,0) NOT NULL DEFAULT 0,
  `TotalSinImpuesto` decimal(10,0) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`IdPedido`, `IdCliente`, `IdUsuario`, `IdCarrito`, `FechaPedido`, `Estado`, `Total`, `MetodoEntrega`, `DireccionEntrega`, `CostoEnvio`, `TotalSinImpuesto`) VALUES
(7, 6, 8, 3, '2026-07-19', 'Entregada', 4200, 'Recogida en tienda', NULL, 0, 0),
(8, 7, 8, 4, '2026-08-06', 'Entregada', 4520, 'Recogida en tienda', '', 0, 4000),
(9, 7, 8, 5, '2026-08-10', 'Entregada', 6698, 'Entrega a domicilio', 'San José Desamparados', 1500, 4600),
(10, 7, 8, 6, '2026-08-10', 'Entregada', 5198, 'Recogida en tienda', '', 0, 4600),
(11, 7, 8, 7, '2026-08-10', 'Entregada', 4520, 'Recogida en tienda', '', 0, 4000),
(12, 7, 10, 8, '2026-08-10', 'Entregada', 6780, 'Recogida en tienda', '', 0, 6000),
(13, 7, 10, 9, '2026-08-10', 'Entregada', 8165, 'Entrega a domicilio', 'San Jose Desamparados', 1500, 5900),
(14, 7, 9, 10, '2026-08-10', 'Entregada', 6245, 'Entrega a domicilio', 'San Pablo Heredia', 1500, 4200),
(15, 7, 9, 11, '2026-08-10', 'Entregada', 6245, 'Entrega a domicilio', 'Desamparados Alajuela', 1500, 4200),
(16, 7, 9, 12, '2026-08-10', 'Entregada', 6700, 'Entrega a domicilio', 'desampa', 1500, 4600),
(17, 7, 9, 13, '2026-08-10', 'Entregada', 11895, 'Entrega a domicilio', 'San pablo', 1500, 9200),
(18, 7, 9, 14, '2026-08-10', 'Entregada', 14015, 'Recogida en tienda', '', 0, 12400),
(19, 7, 13, 15, '2026-08-10', 'Entregada', 6700, 'Entrega a domicilio', 'San Pablo de Heredia', 1500, 4600),
(20, 7, 13, 16, '2026-08-10', 'Entregada', 4745, 'Recogida en tienda', '', 0, 4200),
(21, 7, 9, 17, '2026-08-10', 'Entregada', 12125, 'Entrega a domicilio', 'Heredia Santo Domingo', 1500, 9400),
(22, 7, 9, 18, '2026-08-10', 'Entregada', 4745, 'Recogida en tienda', '', 0, 4200),
(23, 7, 9, 19, '2026-08-11', 'Entregada', 16190, 'Entrega a domicilio', 'Alajuela, Desamparados', 1500, 13000),
(24, 7, 9, 20, '2026-08-11', 'Entregada', 5115, 'Entrega a domicilio', 'San jose', 1500, 3200),
(25, 7, 14, 21, '2026-08-16', 'Entregada', 4295, 'Recogida en tienda', '', 0, 3800),
(26, 7, 14, 22, '2026-08-16', 'Aceptada', 4745, 'Recogida en tienda', '', 0, 4200);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preparacion`
--

CREATE TABLE `preparacion` (
  `IdPreparacion` int(11) NOT NULL,
  `IdPedido` int(11) NOT NULL,
  `Estado` tinyint(1) NOT NULL,
  `HoraInicio` time DEFAULT NULL,
  `HoraFin` time DEFAULT NULL,
  `Observaciones` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productoingredientes`
--

CREATE TABLE `productoingredientes` (
  `IdProducto` int(11) NOT NULL,
  `IdIngrediente` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productoingredientes`
--

INSERT INTO `productoingredientes` (`IdProducto`, `IdIngrediente`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(2, 2),
(2, 3),
(2, 6),
(2, 7),
(2, 8),
(3, 3),
(3, 9),
(3, 10),
(3, 11),
(3, 12),
(4, 1),
(4, 11),
(4, 13),
(4, 14),
(5, 2),
(5, 15),
(5, 16),
(6, 2),
(6, 17),
(6, 18),
(7, 9),
(7, 19),
(7, 20),
(7, 21),
(7, 22),
(8, 20),
(8, 22),
(8, 23),
(8, 24),
(9, 9),
(9, 20),
(9, 25),
(9, 26),
(9, 27),
(10, 6),
(10, 9),
(10, 10),
(10, 20),
(10, 25),
(10, 28),
(11, 29),
(11, 30),
(11, 31),
(11, 32),
(12, 30),
(12, 32),
(12, 33),
(12, 34),
(13, 3),
(13, 13),
(13, 35),
(13, 36),
(13, 37),
(14, 9),
(14, 38),
(14, 39),
(14, 40),
(15, 6),
(15, 9),
(15, 25),
(15, 28),
(15, 41),
(15, 42),
(16, 6),
(16, 13),
(16, 21),
(16, 22),
(16, 28),
(17, 20),
(17, 24),
(17, 25),
(17, 28),
(17, 43),
(18, 2),
(18, 31),
(18, 32),
(18, 44),
(18, 45),
(19, 2),
(19, 7),
(19, 22),
(19, 46),
(21, 9),
(21, 19),
(21, 39),
(21, 41),
(22, 1),
(22, 17),
(22, 45),
(22, 48),
(23, 1),
(23, 17);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productopreparacion`
--

CREATE TABLE `productopreparacion` (
  `IdProducto` int(11) NOT NULL,
  `IdEstacion` int(11) NOT NULL,
  `Orden` int(11) NOT NULL,
  `Estado` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productopreparacion`
--

INSERT INTO `productopreparacion` (`IdProducto`, `IdEstacion`, `Orden`, `Estado`) VALUES
(1, 3, 2, 1),
(1, 4, 1, 1),
(1, 5, 3, 1),
(2, 3, 2, 1),
(2, 4, 1, 1),
(2, 5, 3, 1),
(3, 4, 1, 1),
(3, 5, 2, 1),
(4, 3, 1, 1),
(5, 1, 1, 1),
(5, 5, 2, 1),
(6, 1, 1, 1),
(6, 5, 2, 1),
(7, 4, 1, 1),
(7, 5, 2, 1),
(8, 4, 1, 1),
(8, 5, 2, 1),
(9, 4, 1, 1),
(9, 5, 2, 1),
(10, 4, 1, 1),
(10, 5, 2, 1),
(11, 2, 1, 1),
(11, 5, 2, 1),
(12, 2, 1, 1),
(12, 5, 2, 1),
(13, 3, 1, 1),
(13, 5, 2, 1),
(14, 4, 1, 1),
(14, 5, 2, 1),
(15, 4, 1, 1),
(15, 5, 2, 1),
(16, 4, 1, 1),
(16, 5, 2, 1),
(17, 4, 1, 1),
(17, 5, 2, 1),
(18, 2, 1, 1),
(18, 5, 2, 1),
(19, 1, 1, 1),
(19, 5, 2, 1),
(21, 4, 1, 1),
(21, 5, 2, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `IdProducto` int(11) NOT NULL,
  `IdCategoria` int(11) NOT NULL,
  `Nombre` varchar(150) NOT NULL,
  `Descripcion` text DEFAULT NULL,
  `Imagen` varchar(255) DEFAULT NULL,
  `Precio` decimal(10,0) NOT NULL,
  `Estado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`IdProducto`, `IdCategoria`, `Nombre`, `Descripcion`, `Imagen`, `Precio`, `Estado`) VALUES
(1, 3, 'Pancakes Ronroneo con miel y frutas', 'Pancakes suaves servidos con miel y frutas frescas.', 'producto_20260721_040607_6a5ed40f94c24_Pancakes-Ronroneo.png', 2800, 1),
(2, 3, 'Tostadas francesas con fresas', 'Tostadas doradas con fresas frescas y toque dulce.', 'producto_20260721_040625_6a5ed4219ae1e_Tostadas-Francesas-Ronroneo.png', 2600, 1),
(3, 4, 'Omelette de queso y jamón', 'Omelette caliente con queso fundido y jamón.', 'producto_20260721_041627_6a5ed67b66773_Omelette-Ronroneo.png', 3000, 1),
(4, 3, 'Croissant de mantequilla', 'Croissant dorado y crujiente de mantequilla.', 'producto_20260721_041933_6a5ed7356627a_Croissant-Ronroneo.png', 1600, 1),
(5, 1, 'Café Latte Gatuno', 'Café latte cremoso preparado en barra.', 'producto_20260721_040840_6a5ed4a85dfcc_Latte-Ronroneo.png', 1800, 1),
(6, 1, 'Chocolate caliente con crema', 'Chocolate caliente espeso con crema.', 'producto_20260721_040829_6a5ed49d1e6a1_Chocolate-Crema-Ronroneo.png', 1700, 1),
(7, 5, 'Pasta cremosa con pollo', 'Pasta en salsa cremosa con pollo.', 'producto_20260721_040448_6a5ed3c068172_Pasta-Cremosa-con-Pollo.png', 4500, 1),
(8, 5, 'Arroz con pollo especial', 'Arroz con pollo preparado al estilo Ronroneo.', 'producto_20260721_040428_6a5ed3ac1df28_arroz-con-pollo-especial-ronroneo.png', 4200, 1),
(9, 5, 'Ensalada Cesar con pollo', 'Ensalada Cesar fresca con pollo.', 'producto_20260721_040255_6a5ed34fa459e_Ensalada-cesar-Ronroneo.png', 3800, 1),
(10, 4, 'Sandwich Club Ronroneo', 'Sandwich club con pan tostado y relleno completo.', 'producto_20260721_040526_6a5ed3e65ba86_Sandwich-Ronroneo.png', 3900, 1),
(11, 2, 'Limonada natural', 'Limonada fria preparada con limon natural.', 'producto_20260721_040737_6a5ed4694a426_Limonada-Ronroneo.png', 1300, 1),
(12, 2, 'Té frio de melocotón', 'Té frio con sabor a melocotón.', 'producto_20260721_040711_6a5ed44fd08c6_T__-melocot__n.png', 1400, 1),
(13, 3, 'Cheesecake clásico', 'Cheesecake clásico con base de galleta', 'producto_20260721_041744_6a5ed6c8ea73e_Cheesecake-Ronroneo.png', 1700, 1),
(14, 5, 'Pizza artesanal de queso', 'Pizza artesanal con queso fundido.', 'producto_20260721_034808_6a5ecfd8606e0_Pizza_Ronroneo.png', 4800, 1),
(15, 5, 'Hamburguesa Ronroneo', 'Hamburguesa de la casa con pan artesanal.', 'producto_20260713_190250_6a551a3a927b3_Hamburguesa_Ronroneo.png', 4600, 1),
(16, 5, 'Crema de tomate con pan tostado', 'Crema caliente de tomate acompanada con pan tostado con mantquilla.', 'producto_20260713_191127_6a551c3fed080_Sopa_de_tomate_Ronroneo.png', 3200, 1),
(17, 4, 'Wrap de pollo y vegetales', 'Wrap relleno de pollo y vegetales frescos.', 'producto_20260721_040508_6a5ed3d474808_Wrap-Pollo-Vegetales-Ronroneo.png', 3600, 1),
(18, 2, 'Batido de vainilla', 'Batido frio de vainilla.', 'producto_20260721_040659_6a5ed44376255_Batido-Vainilla-Ronroneo.png', 1800, 1),
(19, 1, 'Té Chai caliente', 'Te chai caliente con especias.', 'producto_20260721_040752_6a5ed4782c2b2_T__-Chai-Ronroneo.png', 1700, 1),
(21, 5, 'Lasaña Gatuna', 'Lasaña gatuna hecha con amor de gatos', 'producto_20260713_184601_6a551649d42a9_Lasa__a_Ronroneo.png', 4200, 1),
(22, 3, 'Brownie con helados', 'Brownie con dos bolas de helado de vainilla', 'producto_20260721_052513_6a5ee699bc7db_Brownie-Ronroneo.png', 2500, 1),
(23, 3, 'Brownie', 'Brownie', 'producto_20260721_053346_6a5ee89abfcad_Brownie-Ronroneo.png', 2500, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `IdRol` int(11) NOT NULL,
  `Nombre` varchar(75) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`IdRol`, `Nombre`) VALUES
(1, 'Administrador'),
(2, 'Cliente'),
(3, 'Encargado'),
(4, 'Cocina');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `IdUsuario` int(11) NOT NULL,
  `IdRol` int(11) DEFAULT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Apellido` varchar(100) NOT NULL,
  `Correo` varchar(150) NOT NULL,
  `Contrasena` varchar(255) NOT NULL,
  `Estado` tinyint(1) NOT NULL,
  `IdEstacion` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`IdUsuario`, `IdRol`, `Nombre`, `Apellido`, `Correo`, `Contrasena`, `Estado`, `IdEstacion`) VALUES
(6, 1, 'Admin', 'Ronroneo', 'admin@ronroneo.com', '$2y$10$.1.kphvzuqiNSom76jfqNOuQrK4Xwan.Z2QIlybzaAnxbzkndvlki', 1, NULL),
(7, 2, 'Gabriel', 'Leiton', 'gaboleitona@gmail.com', '$2y$10$nKWyYMFD6jfAbFbiFpbjkOXuBLKnmK7FmYlutYDrJSN6g4WJUZ666', 1, NULL),
(8, 3, 'Johnny', 'Badilla', 'johnny123@gmail.com', '$2y$10$omTLSbOTs/BDpLPI/HmL2u4U4i7W3f7OFp1KS.Ak0mdyTMvIVlsuu', 1, 2),
(9, 4, 'Martin', 'Lopez', 'MarLop@gmail.com', '$2y$10$utuaww.vlqDrbDt8JPAKPO9se6zqtyKt/.JmH9PHEGl2kG9A0tDT2', 1, 4),
(10, 4, 'Luis', 'Hernandez', 'LuHer@gmail.com', '$2y$10$ENiy5iObnAzhe79KYIG4rOnC6qHQs12R0FftT/VPmrST5dU6CiaJy', 1, 5),
(11, 4, 'Rick', 'Araya', 'RiAra@gmail.com', '$2y$10$ghgrU9bS7kVY1EmE5Un6/e.EWAb1u7IKJfsHhKSWTBNlHIlyw713a', 1, 3),
(12, 4, 'Miguel', 'Blanco', 'MiBla@gmail.com', '$2y$10$trwxXNdIXJohfE1zNUcnauZNrUcQoaPJwuvrKiQNAym9io9QMU9Cm', 1, 1),
(13, 4, 'Bill', 'Gutierrez', 'BiGu@gmail.com', '$2y$10$zJGdXsA3eQGJpTrNM6MqueVig8NK5SYZ6L0nO3GjcHFo4yFsEbsW6', 1, 2),
(14, 3, 'Carl', 'Johnson', 'CJ2004@gmail.com', '$2y$10$NbmZJbzEo/Cw0fGWhZSRGOFr8w0KlPUKkoogeSE4HriqIoXu2VR4C', 1, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carritocombos`
--
ALTER TABLE `carritocombos`
  ADD PRIMARY KEY (`IdCarrito`,`IdCombo`),
  ADD KEY `fk_carritocombo_combo` (`IdCombo`);

--
-- Indices de la tabla `carritoproductos`
--
ALTER TABLE `carritoproductos`
  ADD PRIMARY KEY (`IdCarrito`,`IdProducto`),
  ADD KEY `fk_carritoproducto_producto` (`IdProducto`);

--
-- Indices de la tabla `carritos`
--
ALTER TABLE `carritos`
  ADD PRIMARY KEY (`IdCarrito`),
  ADD KEY `fk_carrito_cliente` (`IdCliente`),
  ADD KEY `fk_carrito_Usuario` (`IdEncargado`);

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`IdCategoria`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`IdCliente`),
  ADD KEY `fk_cliente_usuario` (`IdUsuario`);

--
-- Indices de la tabla `comboproductos`
--
ALTER TABLE `comboproductos`
  ADD PRIMARY KEY (`IdCombo`,`IdProducto`),
  ADD KEY `fk_comboproducto_producto` (`IdProducto`);

--
-- Indices de la tabla `combos`
--
ALTER TABLE `combos`
  ADD PRIMARY KEY (`IdCombo`),
  ADD KEY `fk_combo_menu` (`IdMenu`);

--
-- Indices de la tabla `detallepedidoestacion`
--
ALTER TABLE `detallepedidoestacion`
  ADD PRIMARY KEY (`IdDetalleEstacion`),
  ADD KEY `IdDetalle` (`IdDetalle`),
  ADD KEY `IdEstacion` (`IdEstacion`);

--
-- Indices de la tabla `detallepedidos`
--
ALTER TABLE `detallepedidos`
  ADD PRIMARY KEY (`IdDetalle`),
  ADD KEY `fk_detalle_pedido` (`IdPedido`),
  ADD KEY `fk_detalle_producto` (`IdProducto`),
  ADD KEY `fk_detalle_combo` (`IdCombo`),
  ADD KEY `fk_detalle_estacion` (`IdEstacion`);

--
-- Indices de la tabla `estaciones`
--
ALTER TABLE `estaciones`
  ADD PRIMARY KEY (`IdEstacion`);

--
-- Indices de la tabla `ingredientes`
--
ALTER TABLE `ingredientes`
  ADD PRIMARY KEY (`IdIngrediente`),
  ADD UNIQUE KEY `uk_ingrediente_nombre` (`Nombre`);

--
-- Indices de la tabla `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`IdMenu`);

--
-- Indices de la tabla `menuproductos`
--
ALTER TABLE `menuproductos`
  ADD PRIMARY KEY (`IdMenu`,`IdProducto`),
  ADD KEY `fk_menuproducto_producto` (`IdProducto`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`IdPago`),
  ADD KEY `fk_pago_pedido` (`IdPedido`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`IdPedido`),
  ADD KEY `fk_pedido_cliente` (`IdCliente`),
  ADD KEY `fk_pedido_usuario` (`IdUsuario`),
  ADD KEY `fk_pedido_carrito` (`IdCarrito`);

--
-- Indices de la tabla `preparacion`
--
ALTER TABLE `preparacion`
  ADD PRIMARY KEY (`IdPreparacion`),
  ADD KEY `fk_preparacion_pedido` (`IdPedido`);

--
-- Indices de la tabla `productoingredientes`
--
ALTER TABLE `productoingredientes`
  ADD PRIMARY KEY (`IdProducto`,`IdIngrediente`),
  ADD KEY `fk_productoingrediente_ingrediente` (`IdIngrediente`);

--
-- Indices de la tabla `productopreparacion`
--
ALTER TABLE `productopreparacion`
  ADD PRIMARY KEY (`IdProducto`,`IdEstacion`),
  ADD KEY `fk_productopreparacion_estacion` (`IdEstacion`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`IdProducto`),
  ADD KEY `fk_producto_categoria` (`IdCategoria`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`IdRol`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`IdUsuario`),
  ADD KEY `fk_rol_usuarios` (`IdRol`),
  ADD KEY `fk_usuario_estacion` (`IdEstacion`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carritos`
--
ALTER TABLE `carritos`
  MODIFY `IdCarrito` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `IdCategoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `IdCliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `combos`
--
ALTER TABLE `combos`
  MODIFY `IdCombo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `detallepedidoestacion`
--
ALTER TABLE `detallepedidoestacion`
  MODIFY `IdDetalleEstacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT de la tabla `detallepedidos`
--
ALTER TABLE `detallepedidos`
  MODIFY `IdDetalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `estaciones`
--
ALTER TABLE `estaciones`
  MODIFY `IdEstacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `ingredientes`
--
ALTER TABLE `ingredientes`
  MODIFY `IdIngrediente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT de la tabla `menu`
--
ALTER TABLE `menu`
  MODIFY `IdMenu` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `IdPago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `IdPedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `preparacion`
--
ALTER TABLE `preparacion`
  MODIFY `IdPreparacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `IdProducto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `IdRol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `IdUsuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carritocombos`
--
ALTER TABLE `carritocombos`
  ADD CONSTRAINT `fk_carritocombo_carrito` FOREIGN KEY (`IdCarrito`) REFERENCES `carritos` (`IdCarrito`),
  ADD CONSTRAINT `fk_carritocombo_combo` FOREIGN KEY (`IdCombo`) REFERENCES `combos` (`IdCombo`);

--
-- Filtros para la tabla `carritoproductos`
--
ALTER TABLE `carritoproductos`
  ADD CONSTRAINT `fk_carritoproducto_carrito` FOREIGN KEY (`IdCarrito`) REFERENCES `carritos` (`IdCarrito`),
  ADD CONSTRAINT `fk_carritoproducto_producto` FOREIGN KEY (`IdProducto`) REFERENCES `productos` (`IdProducto`);

--
-- Filtros para la tabla `carritos`
--
ALTER TABLE `carritos`
  ADD CONSTRAINT `fk_carrito_Usuario` FOREIGN KEY (`IdEncargado`) REFERENCES `usuarios` (`IdUsuario`),
  ADD CONSTRAINT `fk_carrito_cliente` FOREIGN KEY (`IdCliente`) REFERENCES `clientes` (`IdCliente`);

--
-- Filtros para la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD CONSTRAINT `fk_cliente_usuario` FOREIGN KEY (`IdUsuario`) REFERENCES `usuarios` (`IdUsuario`);

--
-- Filtros para la tabla `comboproductos`
--
ALTER TABLE `comboproductos`
  ADD CONSTRAINT `fk_comboproducto_combo` FOREIGN KEY (`IdCombo`) REFERENCES `combos` (`IdCombo`),
  ADD CONSTRAINT `fk_comboproducto_producto` FOREIGN KEY (`IdProducto`) REFERENCES `productos` (`IdProducto`);

--
-- Filtros para la tabla `combos`
--
ALTER TABLE `combos`
  ADD CONSTRAINT `fk_combo_menu` FOREIGN KEY (`IdMenu`) REFERENCES `menu` (`IdMenu`);

--
-- Filtros para la tabla `detallepedidoestacion`
--
ALTER TABLE `detallepedidoestacion`
  ADD CONSTRAINT `detallepedidoestacion_ibfk_1` FOREIGN KEY (`IdDetalle`) REFERENCES `detallepedidos` (`IdDetalle`),
  ADD CONSTRAINT `detallepedidoestacion_ibfk_2` FOREIGN KEY (`IdEstacion`) REFERENCES `estaciones` (`IdEstacion`);

--
-- Filtros para la tabla `detallepedidos`
--
ALTER TABLE `detallepedidos`
  ADD CONSTRAINT `fk_detalle_combo` FOREIGN KEY (`IdCombo`) REFERENCES `combos` (`IdCombo`),
  ADD CONSTRAINT `fk_detalle_estacion` FOREIGN KEY (`IdEstacion`) REFERENCES `estaciones` (`IdEstacion`),
  ADD CONSTRAINT `fk_detalle_pedido` FOREIGN KEY (`IdPedido`) REFERENCES `pedidos` (`IdPedido`),
  ADD CONSTRAINT `fk_detalle_producto` FOREIGN KEY (`IdProducto`) REFERENCES `productos` (`IdProducto`);

--
-- Filtros para la tabla `menuproductos`
--
ALTER TABLE `menuproductos`
  ADD CONSTRAINT `fk_menuproducto_menu` FOREIGN KEY (`IdMenu`) REFERENCES `menu` (`IdMenu`),
  ADD CONSTRAINT `fk_menuproducto_producto` FOREIGN KEY (`IdProducto`) REFERENCES `productos` (`IdProducto`);

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `fk_pago_pedido` FOREIGN KEY (`IdPedido`) REFERENCES `pedidos` (`IdPedido`);

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `fk_pedido_carrito` FOREIGN KEY (`IdCarrito`) REFERENCES `carritos` (`IdCarrito`),
  ADD CONSTRAINT `fk_pedido_cliente` FOREIGN KEY (`IdCliente`) REFERENCES `clientes` (`IdCliente`),
  ADD CONSTRAINT `fk_pedido_usuario` FOREIGN KEY (`IdUsuario`) REFERENCES `usuarios` (`IdUsuario`);

--
-- Filtros para la tabla `preparacion`
--
ALTER TABLE `preparacion`
  ADD CONSTRAINT `fk_preparacion_pedido` FOREIGN KEY (`IdPedido`) REFERENCES `pedidos` (`IdPedido`);

--
-- Filtros para la tabla `productoingredientes`
--
ALTER TABLE `productoingredientes`
  ADD CONSTRAINT `fk_productoingrediente_ingrediente` FOREIGN KEY (`IdIngrediente`) REFERENCES `ingredientes` (`IdIngrediente`),
  ADD CONSTRAINT `fk_productoingrediente_producto` FOREIGN KEY (`IdProducto`) REFERENCES `productos` (`IdProducto`) ON DELETE CASCADE;

--
-- Filtros para la tabla `productopreparacion`
--
ALTER TABLE `productopreparacion`
  ADD CONSTRAINT `fk_productopreparacion_estacion` FOREIGN KEY (`IdEstacion`) REFERENCES `estaciones` (`IdEstacion`),
  ADD CONSTRAINT `fk_productopreparacion_producto` FOREIGN KEY (`IdProducto`) REFERENCES `productos` (`IdProducto`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `fk_producto_categoria` FOREIGN KEY (`IdCategoria`) REFERENCES `categoria` (`IdCategoria`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_rol_usuarios` FOREIGN KEY (`IdRol`) REFERENCES `rol` (`IdRol`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_usuario_estacion` FOREIGN KEY (`IdEstacion`) REFERENCES `estaciones` (`IdEstacion`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
