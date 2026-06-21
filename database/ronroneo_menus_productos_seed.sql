USE cafeteriaronroneo;

SET NAMES utf8mb4;

SET @existe_hora_inicio := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'menu'
    AND COLUMN_NAME = 'HoraInicio'
);
SET @sql_hora_inicio := IF(
  @existe_hora_inicio = 0,
  'ALTER TABLE menu ADD COLUMN HoraInicio TIME NULL AFTER Descripcion',
  'SELECT 1'
);
PREPARE stmt_hora_inicio FROM @sql_hora_inicio;
EXECUTE stmt_hora_inicio;
DEALLOCATE PREPARE stmt_hora_inicio;

SET @existe_hora_fin := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'menu'
    AND COLUMN_NAME = 'HoraFin'
);
SET @sql_hora_fin := IF(
  @existe_hora_fin = 0,
  'ALTER TABLE menu ADD COLUMN HoraFin TIME NULL AFTER HoraInicio',
  'SELECT 1'
);
PREPARE stmt_hora_fin FROM @sql_hora_fin;
EXECUTE stmt_hora_fin;
DEALLOCATE PREPARE stmt_hora_fin;

SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM carritoproductos;
DELETE FROM carritocombos;
DELETE FROM detallepedidos;
DELETE FROM comboproductos;
DELETE FROM productopreparacion;
DELETE FROM combos;
DELETE FROM productos;
DELETE FROM menu;

ALTER TABLE productos AUTO_INCREMENT = 1;
ALTER TABLE combos AUTO_INCREMENT = 1;
ALTER TABLE menu AUTO_INCREMENT = 1;

SET FOREIGN_KEY_CHECKS = 1;

UPDATE categoria
SET Nombre = 'Bebidas Calientes',
    Descripcion = 'Cafes, tes y bebidas calientes'
WHERE IdCategoria = 1;

UPDATE categoria
SET Nombre = 'Bebidas Frias',
    Descripcion = 'Limonadas, batidos y bebidas frias'
WHERE IdCategoria = 2;

UPDATE categoria
SET Nombre = 'Reposteria y Postres',
    Descripcion = 'Pancakes, tostadas, croissants y postres'
WHERE IdCategoria = 3;

UPDATE categoria
SET Nombre = 'Bocadillos y Wraps',
    Descripcion = 'Sandwiches, wraps y comidas rapidas'
WHERE IdCategoria = 4;

INSERT INTO categoria (IdCategoria, Nombre, Descripcion)
VALUES (5, 'Platos Fuertes', 'Pastas, arroz, pizza, hamburguesas y platos de cocina')
ON DUPLICATE KEY UPDATE
  Nombre = VALUES(Nombre),
  Descripcion = VALUES(Descripcion);

INSERT INTO menu (IdMenu, Nombre, Descripcion, HoraInicio, HoraFin, FechaInicio, FechaFin, Estado)
VALUES
(1, 'Menu Desayuno', 'Horario: 7:00 a. m. a 12:00 m.', '07:00:00', '12:00:00', '2026-01-01', '2026-12-31', 1),
(2, 'Menu Almuerzo', 'Horario: 1:00 p. m. a 6:00 p. m.', '13:00:00', '18:00:00', '2026-01-01', '2026-12-31', 1),
(3, 'Menu Cena', 'Horario: 7:00 p. m. a 12:00 a. m.', '19:00:00', '00:00:00', '2026-01-01', '2026-12-31', 1);

INSERT INTO productos (IdProducto, IdCategoria, Nombre, Descripcion, ingredientes, Imagen, Precio, Estado)
VALUES
(1, 3, 'Pancakes Ronroneo con miel y frutas', 'Pancakes suaves servidos con miel y frutas frescas.', 'Harina, leche, huevo, miel, frutas', 'd-pancakesRonroneoMielFrutas.webp', 2800, 1),
(2, 3, 'Tostadas francesas con fresas', 'Tostadas doradas con fresas frescas y toque dulce.', 'Pan, huevo, leche, canela, fresas', 'd-TostadasFrancesasFresas.jpg', 2600, 1),
(3, 4, 'Omelette de queso y jamon', 'Omelette caliente con queso fundido y jamon.', 'Huevo, queso, jamon, sal, pimienta', 'd-omeletteJamonQueso.webp', 3000, 1),
(4, 3, 'Croissant de mantequilla', 'Croissant dorado y crujiente de mantequilla.', 'Harina, mantequilla, levadura, sal', 'd-croissantMantequilla.jpg', 1600, 1),
(5, 1, 'Cafe Latte Gatuno', 'Cafe latte cremoso preparado en barra.', 'Cafe, leche, espuma de leche', 'd-CafeLatteGatuno.jpg', 1800, 1),
(6, 1, 'Chocolate caliente con crema', 'Chocolate caliente espeso con crema.', 'Chocolate, leche, crema batida', 'd-ChocolateCalienteConCrema.webp', 1700, 1),
(7, 5, 'Pasta cremosa con pollo', 'Pasta en salsa cremosa con pollo.', 'Pasta, pollo, crema, queso, especias', 'a-Pasta cremosa con pollo.jpg', 4500, 1),
(8, 5, 'Arroz con pollo especial', 'Arroz con pollo preparado al estilo Ronroneo.', 'Arroz, pollo, vegetales, especias', 'a-ArrozConPolloEspecial.jpg', 4200, 1),
(9, 5, 'Ensalada Cesar con pollo', 'Ensalada Cesar fresca con pollo.', 'Lechuga, pollo, crutones, queso, aderezo Cesar', 'a-ensaladaCesarConPollo.jpg', 3800, 1),
(10, 4, 'Sandwich Club Ronroneo', 'Sandwich club con pan tostado y relleno completo.', 'Pan, pollo, jamon, queso, lechuga, tomate', 'a-sandwichClubRonroneo.jpg', 3900, 1),
(11, 2, 'Limonada natural', 'Limonada fria preparada con limon natural.', 'Limon, agua, azucar, hielo', 'a-limonadaNatural.jpg', 1300, 1),
(12, 2, 'Te frio de melocoton', 'Te frio con sabor a melocoton.', 'Te, melocoton, agua, hielo', 'a-teFrioMelocoton.jpg', 1400, 1),
(13, 3, 'Brownie de chocolate', 'Brownie dulce de chocolate para acompanar combos.', 'Chocolate, harina, huevo, mantequilla', 'cheesecake.jpg', 1700, 1),
(14, 5, 'Pizza artesanal de queso', 'Pizza artesanal con queso fundido.', 'Masa, salsa de tomate, queso, oregano', 'c-pizzaArtesanalQueso.webp', 4800, 1),
(15, 5, 'Hamburguesa Ronroneo', 'Hamburguesa de la casa con pan artesanal.', 'Pan, carne, queso, lechuga, tomate, salsa', 'c-hamburguesaRonroneo.jpg', 4600, 1),
(16, 5, 'Crema de tomate con pan tostado', 'Crema caliente de tomate acompanada con pan tostado.', 'Tomate, crema, especias, pan', 'c-cremaDeTomateConPanTostado.jpg', 3200, 1),
(17, 4, 'Wrap de pollo y vegetales', 'Wrap relleno de pollo y vegetales frescos.', 'Tortilla, pollo, lechuga, tomate, vegetales', 'c-wrapDePolloYVegetales.webp', 3600, 1),
(18, 2, 'Batido de vainilla', 'Batido frio de vainilla.', 'Leche, vainilla, hielo, azucar', 'c-batidoVainilla.jpg', 1800, 1),
(19, 1, 'Te Chai caliente', 'Te chai caliente con especias.', 'Te chai, leche, canela, especias', 'c-teChaiCaliente.avif', 1700, 1);

INSERT INTO combos (IdCombo, IdMenu, Nombre, Descripcion, Precio, Estado)
VALUES
(1, 1, 'Combo Gatito Dulce', 'Pancakes Ronroneo con miel y frutas y Cafe Latte Gatuno.', 4300, 1),
(2, 1, 'Combo Manana Feliz', 'Omelette de queso y jamon, Croissant de mantequilla y Chocolate caliente con crema.', 5800, 1),
(3, 1, 'Combo Bigotes', 'Tostadas francesas con fresas y Cafe Latte Gatuno.', 4000, 1),
(4, 2, 'Combo Ronroneo Clasico', 'Pasta cremosa con pollo y Limonada natural.', 5400, 1),
(5, 2, 'Combo Gatuno Ligero', 'Ensalada Cesar con pollo y Te frio de melocoton.', 4700, 1),
(6, 2, 'Combo Bigotes Lunch', 'Sandwich Club Ronroneo, Limonada natural y Brownie de chocolate.', 6200, 1),
(7, 3, 'Combo Noche Gatuna', 'Pizza artesanal de queso y Te Chai caliente.', 5900, 1),
(8, 3, 'Combo Ronroneo Especial', 'Hamburguesa Ronroneo y Batido de vainilla.', 5900, 1),
(9, 3, 'Combo Cena Suave', 'Crema de tomate con pan tostado y Te Chai caliente.', 4600, 1);

INSERT INTO comboproductos (IdCombo, IdProducto, Cantidad)
VALUES
(1, 1, 1), (1, 5, 1),
(2, 3, 1), (2, 4, 1), (2, 6, 1),
(3, 2, 1), (3, 5, 1),
(4, 7, 1), (4, 11, 1),
(5, 9, 1), (5, 12, 1),
(6, 10, 1), (6, 11, 1), (6, 13, 1),
(7, 14, 1), (7, 19, 1),
(8, 15, 1), (8, 18, 1),
(9, 16, 1), (9, 19, 1);

INSERT INTO productopreparacion (IdProducto, IdEstacion, Orden)
VALUES
(1, 4, 1), (1, 3, 2), (1, 5, 3),
(2, 4, 1), (2, 3, 2), (2, 5, 3),
(3, 4, 1), (3, 5, 2),
(4, 3, 1), (4, 5, 2),
(5, 1, 1), (5, 5, 2),
(6, 1, 1), (6, 5, 2),
(7, 4, 1), (7, 5, 2),
(8, 4, 1), (8, 5, 2),
(9, 4, 1), (9, 5, 2),
(10, 4, 1), (10, 5, 2),
(11, 2, 1), (11, 5, 2),
(12, 2, 1), (12, 5, 2),
(13, 3, 1), (13, 5, 2),
(14, 4, 1), (14, 5, 2),
(15, 4, 1), (15, 5, 2),
(16, 4, 1), (16, 5, 2),
(17, 4, 1), (17, 5, 2),
(18, 2, 1), (18, 5, 2),
(19, 1, 1), (19, 5, 2);
