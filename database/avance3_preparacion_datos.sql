USE `cafeteriaronroneo`;

CREATE TABLE IF NOT EXISTS `estaciones` (
  `IdEstacion` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`IdEstacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `productopreparacion` (
  `IdProducto` int(11) NOT NULL,
  `IdEstacion` int(11) NOT NULL,
  `Orden` int(11) NOT NULL,
  PRIMARY KEY (`IdProducto`,`IdEstacion`),
  KEY `fk_productopreparacion_estacion` (`IdEstacion`),
  CONSTRAINT `fk_productopreparacion_producto` FOREIGN KEY (`IdProducto`) REFERENCES `productos` (`IdProducto`),
  CONSTRAINT `fk_productopreparacion_estacion` FOREIGN KEY (`IdEstacion`) REFERENCES `estaciones` (`IdEstacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT IGNORE INTO `estaciones` (`IdEstacion`, `Nombre`) VALUES
(1, 'Barra de cafe'),
(2, 'Bebidas frias'),
(3, 'Reposteria'),
(4, 'Cocina caliente'),
(5, 'Empaque');

INSERT IGNORE INTO `productopreparacion` (`IdProducto`, `IdEstacion`, `Orden`) VALUES
(1, 1, 1),
(2, 1, 1),
(2, 5, 2),
(3, 2, 1),
(4, 2, 1),
(5, 3, 1),
(5, 5, 2),
(6, 3, 1),
(7, 4, 1),
(7, 5, 2),
(8, 4, 1),
(8, 2, 2),
(8, 5, 3);

INSERT IGNORE INTO `menu` (`IdMenu`, `Nombre`, `Descripcion`, `FechaInicio`, `FechaFin`, `Estado`) VALUES
(4, 'Menu de Almuerzo Ligero', 'Opciones rapidas para almuerzo en cafeteria', '2026-06-01', '2026-08-31', 1);

INSERT IGNORE INTO `combos` (`IdCombo`, `IdMenu`, `Nombre`, `Descripcion`, `Precio`, `Estado`) VALUES
(4, 4, 'Combo Almuerzo Ligero', 'Sandwich + Limonada + Cheesecake', 6500.00, 1);

INSERT IGNORE INTO `comboproductos` (`IdCombo`, `IdProducto`, `Cantidad`) VALUES
(4, 7, 1),
(4, 4, 1),
(4, 6, 1);
