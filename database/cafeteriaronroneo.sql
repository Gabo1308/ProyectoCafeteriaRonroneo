-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-06-2026 a las 19:45:25
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
  `Cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carritoproductos`
--

CREATE TABLE `carritoproductos` (
  `IdCarrito` int(11) NOT NULL,
  `IdProducto` int(11) NOT NULL,
  `Cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carritos`
--

CREATE TABLE `carritos` (
  `IdCarrito` int(11) NOT NULL,
  `IdCliente` int(11) NOT NULL,
  `FechaCreacion` date NOT NULL,
  `Estado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `IdCategoria` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `categoria` (`IdCategoria`, `Nombre`, `Descripcion`) VALUES
(1, 'Bebidas Calientes', 'Cafés, tés y otras bebidas calientes'),
(2, 'Bebidas Frías', 'Jugos, batidos y bebidas frías'),
(3, 'Repostería', 'Pasteles, galletas y postres'),
(4, 'Bocadillos', 'Sandwiches, wraps y bocadillos salados');
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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comboproductos`
--

CREATE TABLE `comboproductos` (
  `IdCombo` int(11) NOT NULL,
  `IdProducto` int(11) NOT NULL,
  `Cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `comboproductos` (`IdCombo`, `IdProducto`, `Cantidad`) VALUES
(1, 5, 1),
(1, 1, 1),
(2, 6, 1),
(2, 4, 1),
(3, 3, 1),
(3, 8, 1);
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `combos`
--

CREATE TABLE `combos` (
  `IdCombo` int(11) NOT NULL,
  `IdMenu` int(11) NOT NULL,
  `Nombre` varchar(150) NOT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  `Precio` decimal(10,2) NOT NULL,
  `Estado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `combos` (`IdCombo`, `IdMenu`, `Nombre`, `Descripcion`, `Precio`, `Estado`) VALUES
(1, 1, 'Combo Desayuno Clásico', 'Croissant + Cappuccino', 3800.00, 1),
(2, 2, 'Combo Merienda', 'Cheesecake + Limonada Natural', 4200.00, 1),
(3, 3, 'Combo Saludable', 'Batido de Fresa + Wrap de Pollo', 5500.00, 1);
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detallepedidos`
--

CREATE TABLE `detallepedidos` (
  `IdDetalle` int(11) NOT NULL,
  `IdPedido` int(11) NOT NULL,
  `IdProducto` int(11) NOT NULL,
  `IdCombo` int(11) DEFAULT NULL,
  `Cantidad` int(11) NOT NULL,
  `PrecioUnitario` decimal(10,0) NOT NULL,
  `Subtotal` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `menu`
--

CREATE TABLE `menu` (
  `IdMenu` int(11) NOT NULL,
  `Nombre` varchar(150) NOT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  `FechaInicio` date NOT NULL,
  `FechaFin` date NOT NULL,
  `Estado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `menu` (`IdMenu`, `Nombre`, `Descripcion`, `FechaInicio`, `FechaFin`, `Estado`) VALUES
(1, 'Menú de Desayuno', 'Opciones de desayuno para empezar el día', '2026-06-01', '2026-08-31', 1),
(2, 'Menú de Merienda', 'Repostería y bebidas para la pausa del día', '2026-06-01', '2026-08-31', 1),
(3, 'Menú Especial Fin de Semana', 'Menú especial para sábado y domingo', '2026-06-01', '2026-08-31', 1);
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
  `Estado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `Estado` tinyint(1) NOT NULL,
  `Total` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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


INSERT INTO `preparacion` (`IdPreparacion`, `IdPedido`, `Estado`, `HoraInicio`, `HoraFin`, `Observaciones`) VALUES
(1, 1, 1, '08:00:00', '08:10:00', 'Preparación de Cappuccino y Croissant'),
(2, 2, 1, '10:30:00', '10:40:00', 'Preparación de Cheesecake y Limonada'),
(3, 3, 0, '12:00:00', NULL, 'Pendiente: Batido y Wrap en preparación');
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `IdProducto` int(11) NOT NULL,
  `IdCategoria` int(11) NOT NULL,
  `Nombre` varchar(150) NOT NULL,
  `Descripcion` text DEFAULT NULL,
  `ingredientes` varchar(255) NOT NULL,
  `Imagen` varchar(255) DEFAULT NULL,
  `Precio` decimal(10,0) NOT NULL,
  `Estado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `productos` (`IdProducto`, `IdCategoria`, `Nombre`, `Descripcion`, `ingredientes`, `Imagen`, `Precio`, `Estado`) VALUES
(1, 1, 'Cappuccino', 'Café espresso con leche espumosa y canela', 'Café, leche, canela', 'cappuccino.jpg', 2200, 1),
(2, 1, 'Latte de Vainilla', 'Café suave con leche vaporizada y sirope de vainilla', 'Café, leche, vainilla', 'latte_vainilla.jpg', 2400, 1),
(3, 2, 'Batido de Fresa', 'Batido cremoso de fresas frescas y leche', 'Fresa, leche, azúcar', 'Batido_fresa.jpg', 2800, 1),
(4, 2, 'Limonada Natural', 'Limonada fresca exprimida con menta y hielo', 'Limón, menta, azúcar', 'limonada.jpg', 1500, 1),
(5, 3, 'Croissant de Mantequilla', 'Croissant hojaldrado con mantequilla premium', 'Harina, mantequilla, huevo', 'croissant.jpg', 1900, 1),
(6, 3, 'Cheesecake clásico', 'Porción de cheesecake cremoso', 'Queso crema, Crema de leche, galleta', 'cheesecake.jpg', 3200, 1),
(7, 4, 'Sandwich de Jamón y Queso', 'Sandwich tostado en pan integral', 'Pan, jamón, queso, tomate', 'sandwich_jq.jpg', 2600, 1),
(8, 4, 'Wrap de Pollo', 'Wrap de pollo a la plancha con vegetales', 'Tortilla, pollo, lechuga, tomate', 'wrap_pollo.jpg', 3000, 1);
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `IdRol` int(11) NOT NULL,
  `Nombre` varchar(75) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `Estado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  ADD KEY `fk_carrito_cliente` (`IdCliente`);

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
-- Indices de la tabla `detallepedidos`
--
ALTER TABLE `detallepedidos`
  ADD PRIMARY KEY (`IdDetalle`),
  ADD KEY `fk_detalle_pedido` (`IdPedido`),
  ADD KEY `fk_detalle_producto` (`IdProducto`),
  ADD KEY `fk_detalle_combo` (`IdCombo`);

--
-- Indices de la tabla `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`IdMenu`);

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
  ADD KEY `IdRol` (`IdRol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carritos`
--
ALTER TABLE `carritos`
  MODIFY `IdCarrito` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `IdCategoria` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `IdCliente` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `combos`
--
ALTER TABLE `combos`
  MODIFY `IdCombo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detallepedidos`
--
ALTER TABLE `detallepedidos`
  MODIFY `IdDetalle` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `menu`
--
ALTER TABLE `menu`
  MODIFY `IdMenu` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `IdPago` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `IdPedido` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `preparacion`
--
ALTER TABLE `preparacion`
  MODIFY `IdPreparacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `IdProducto` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `IdUsuario` int(11) NOT NULL AUTO_INCREMENT;

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
-- Filtros para la tabla `detallepedidos`
--
ALTER TABLE `detallepedidos`
  ADD CONSTRAINT `fk_detalle_combo` FOREIGN KEY (`IdCombo`) REFERENCES `combos` (`IdCombo`),
  ADD CONSTRAINT `fk_detalle_pedido` FOREIGN KEY (`IdPedido`) REFERENCES `pedidos` (`IdPedido`),
  ADD CONSTRAINT `fk_detalle_producto` FOREIGN KEY (`IdProducto`) REFERENCES `productos` (`IdProducto`);

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
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `fk_producto_categoria` FOREIGN KEY (`IdCategoria`) REFERENCES `categoria` (`IdCategoria`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_rol_usuarios` FOREIGN KEY (`IdRol`) REFERENCES `rol` (`IdRol`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
