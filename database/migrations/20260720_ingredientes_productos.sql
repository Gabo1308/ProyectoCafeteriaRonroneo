-- Migracion: catalogo de ingredientes y relacion muchos a muchos con productos.
-- Antes de ejecutarla en otra instalacion, exporte una copia de la base de datos.

CREATE TABLE IF NOT EXISTS `ingredientes` (
  `IdIngrediente` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`IdIngrediente`),
  UNIQUE KEY `uk_ingrediente_nombre` (`Nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `ingredientes` (`IdIngrediente`, `Nombre`) VALUES
(1, 'Harina'),
(2, 'Leche'),
(3, 'Huevo'),
(4, 'Miel'),
(5, 'Frutas'),
(6, 'Pan'),
(7, 'Canela'),
(8, 'Fresas'),
(9, 'Queso'),
(10, 'Jamón'),
(11, 'Sal'),
(12, 'Pimienta'),
(13, 'Mantequilla'),
(14, 'Levadura'),
(15, 'Café'),
(16, 'Espuma de leche'),
(17, 'Chocolate'),
(18, 'Crema batida'),
(19, 'Pasta'),
(20, 'Pollo'),
(21, 'Crema'),
(22, 'Especias'),
(23, 'Arroz'),
(24, 'Vegetales'),
(25, 'Lechuga'),
(26, 'Crutones'),
(27, 'Aderezo César'),
(28, 'Tomate'),
(29, 'Limón'),
(30, 'Agua'),
(31, 'Azúcar'),
(32, 'Hielo'),
(33, 'Té'),
(34, 'Melocotón'),
(35, 'Leche condensada'),
(36, 'Crema de leche'),
(37, 'Galletas'),
(38, 'Masa'),
(39, 'Salsa de tomate'),
(40, 'Orégano'),
(41, 'Carne'),
(42, 'Salsa'),
(43, 'Tortilla'),
(44, 'Vainilla'),
(45, 'Helado de vainilla'),
(46, 'Té chai'),
(47, 'Jarabe de canela'),
(48, 'Jarabe de chocolate'),
(49, 'Jarabe de vainilla')
ON DUPLICATE KEY UPDATE `Nombre` = VALUES(`Nombre`);

CREATE TABLE IF NOT EXISTS `productoingredientes` (
  `IdProducto` int(11) NOT NULL,
  `IdIngrediente` int(11) NOT NULL,
  PRIMARY KEY (`IdProducto`, `IdIngrediente`),
  KEY `fk_productoingrediente_ingrediente` (`IdIngrediente`),
  CONSTRAINT `fk_productoingrediente_producto`
    FOREIGN KEY (`IdProducto`) REFERENCES `productos` (`IdProducto`) ON DELETE CASCADE,
  CONSTRAINT `fk_productoingrediente_ingrediente`
    FOREIGN KEY (`IdIngrediente`) REFERENCES `ingredientes` (`IdIngrediente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Convierte cada valor legado separado por comas antes de retirar la columna.
-- utf8mb4_general_ci permite que Cafe/Café y jamon/Jamón coincidan.
INSERT IGNORE INTO `productoingredientes` (`IdProducto`, `IdIngrediente`)
SELECT p.IdProducto, i.IdIngrediente
FROM `productos` p
INNER JOIN `ingredientes` i
  ON FIND_IN_SET(
    REPLACE(LOWER(i.Nombre), ' ', ''),
    REPLACE(LOWER(p.ingredientes), ' ', '')
  ) > 0;

ALTER TABLE `productos` DROP COLUMN IF EXISTS `ingredientes`;

ALTER TABLE `ingredientes` AUTO_INCREMENT = 50;
