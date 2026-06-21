# Avance 3 - Cumplimiento MVC

Este documento resume como Cafeteria Ronroneo cubre el Avance 3 siguiendo el flujo:

```text
React Component -> Service.js -> index.php -> RoutesController.php -> Controller.php -> Model.php -> MySQL
```

## Requerimientos generales

- Los datos se cargan desde MySQL en la base `cafeteriaronroneo`.
- La semilla principal esta en `database/ronroneo_menus_productos_seed.sql`.
- Las imagenes usadas por productos estan en `uploads/`.
- Las pantallas React consumen datos mediante servicios Axios.
- Los controladores PHP responden JSON usando `Response`.
- Los modelos PHP concentran las consultas a base de datos.

> Nota tecnica: el proyecto base del profesor usa PHP y consultas SQL en los modelos. En este proyecto se mantiene esa arquitectura. El requerimiento de LINQ se interpreta en este contexto como consultas centralizadas en la capa Model, equivalente a la capa de acceso a datos del proyecto de clase.

## Productos

Backend:

- `controllers/ProductoController.php`
- `models/ProductoModel.php`

Frontend:

- `ProyectoCafeteriaRonroneo/src/services/ProductosServices.js`
- `ProyectoCafeteriaRonroneo/src/components/Cafeteria/CatalogProductos.jsx`
- `ProyectoCafeteriaRonroneo/src/components/Cafeteria/ListCardProductos.jsx`
- `ProyectoCafeteriaRonroneo/src/components/Cafeteria/DetalleProductos.jsx`

Endpoints:

```text
GET /producto
GET /producto/{id}
GET /producto/getByCategoria/{idCategoria}
```

Cumple:

- Listado con cards, no tabla.
- Maximo 4 campos relevantes en listado: nombre, categoria, descripcion y precio.
- Enlace a detalle por producto.
- Detalle con nombre, descripcion, ingredientes, categoria, imagen y precio.

## Combos

Backend:

- `controllers/ComboController.php`
- `models/ComboModel.php`

Frontend:

- `ProyectoCafeteriaRonroneo/src/services/CombosServices.js`
- `ProyectoCafeteriaRonroneo/src/components/Cafeteria/CatalogCombos.jsx`
- `ProyectoCafeteriaRonroneo/src/components/Cafeteria/ListCardCombos.jsx`
- `ProyectoCafeteriaRonroneo/src/components/Cafeteria/DetalleCombos.jsx`

Endpoints:

```text
GET /combo
GET /combo/{id}
GET /combo/getProductos/{idCombo}
```

Cumple:

- Listado de combos con informacion relevante.
- Enlace a detalle por combo.
- Detalle con nombre, precio y productos del combo.
- Datos precargados con combos de 2 y 3 productos.

## Menus

Backend:

- `controllers/MenuController.php`
- `models/MenuModel.php`
- Tabla puente `menuproductos`.

Frontend:

- `ProyectoCafeteriaRonroneo/src/services/MenuServices.js`
- `ProyectoCafeteriaRonroneo/src/components/Cafeteria/CatalogMenu.jsx`
- `ProyectoCafeteriaRonroneo/src/components/Cafeteria/ListCardMenu.jsx`
- `ProyectoCafeteriaRonroneo/src/components/Cafeteria/MenuDisponible.jsx`

Endpoints:

```text
GET /menu
GET /menu/{id}
GET /menu/getDisponible
GET /menu/getProductos/{idMenu}
GET /menu/getCombos/{idMenu}
```

Cumple:

- Listado de menus registrados.
- Muestra nombre, fechas, horas, dias y estado.
- Menu disponible segun fecha, hora y estado.
- Menu disponible con formato visual de restaurante.
- Productos agrupados por categoria.
- Productos y combos del menu actual, no todos los registros del sistema.

## Procesos de preparacion

Backend:

- `controllers/PreparacionController.php`
- `models/PreparacionModel.php`
- Tablas `estaciones` y `productopreparacion`.

Frontend:

- `ProyectoCafeteriaRonroneo/src/services/PreparacionServices.js`
- `ProyectoCafeteriaRonroneo/src/components/Cafeteria/CatalogPreparacion.jsx`
- `ProyectoCafeteriaRonroneo/src/components/Cafeteria/DetallePreparacion.jsx`

Endpoints:

```text
GET /preparacion
GET /preparacion/{idProducto}
```

Cumple:

- Listado con nombre del producto y cantidad de pasos.
- Enlace a detalle del proceso.
- Detalle con producto y estaciones en orden.
- Datos precargados con ejemplos de 1, 2 y 3 estaciones.

## Rutas React

Archivo:

- `ProyectoCafeteriaRonroneo/src/main.jsx`

Rutas principales:

```text
/catalog-productos/
/producto/:id
/catalog-combos/
/combo/:id
/catalog-menu/
/menu-disponible/
/catalog-preparacion/
/preparacion/:id
```
