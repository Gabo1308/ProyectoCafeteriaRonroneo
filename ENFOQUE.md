# Enfoque del Proyecto Cafeteria Ronroneo

## Tipo de Negocio

El proyecto **Cafeteria Ronroneo** se enfoca en una cafeteria que ofrece productos individuales, combos y menus disponibles por temporada o periodo. El sistema busca gestionar la experiencia completa desde la visualizacion del menu hasta el proceso de pedidos, pagos y preparacion en cocina.

Este enfoque responde al enunciado del proyecto, que solicita una aplicacion web para un servicio de comida que gestione procesos de preparacion.

## Propuesta General

Cafeteria Ronroneo sera una aplicacion web compuesta por:

- Un frontend en React para la interfaz del usuario.
- Un backend en PHP funcionando como API.
- Una base de datos MySQL/MariaDB para almacenar productos, categorias, usuarios, pedidos, pagos y preparacion.

La aplicacion seguira la arquitectura trabajada en clase y usada como referencia en el proyecto del profesor:

```text
React Component -> Service.js -> URL -> index.php -> RoutesController.php -> Controller.php -> Model.php -> MySQL
```

## Objetivo del Sistema

Permitir que una cafeteria pueda gestionar:

- Productos.
- Categorias.
- Combos.
- Menus disponibles.
- Usuarios por roles.
- Pedidos.
- Pagos.
- Preparacion de pedidos.
- Seguimiento e historial.
- Dashboard administrativo.

## Alcance Funcional

### Pagina de Inicio

La pagina de inicio presentara una introduccion a Cafeteria Ronroneo y mostrara el menu disponible para cualquier visitante.

Debe tener un diseno alusivo a una cafeteria, amigable y facil de navegar.

### Gestion de Productos

El administrador podra crear, consultar y modificar productos.

Cada producto tendra:

- Nombre.
- Descripcion.
- Ingredientes.
- Categoria.
- Imagen.
- Precio.
- Estado.

Las categorias iniciales del proyecto son:

- Bebidas Calientes.
- Bebidas Frias.
- Reposteria.
- Bocadillos.

### Gestion de Categorias

Las categorias agruparan los productos de forma logica para facilitar la navegacion y el filtrado del menu.

Los usuarios podran ver productos filtrados por categoria.

### Gestion de Combos

El administrador podra crear combos compuestos por uno o varios productos.

Cada combo tendra:

- Nombre.
- Descripcion.
- Productos asociados.
- Precio especial.
- Estado.
- Menu al que pertenece.

Los combos se mostraran como items individuales dentro del menu.

### Gestion de Menu

El sistema permitira definir menus disponibles segun fechas.

Cada menu tendra:

- Nombre.
- Descripcion.
- Fecha de inicio.
- Fecha de fin.
- Estado.

La aplicacion debe mostrar al publico el menu disponible y permitir visualizar sus productos o combos.

### Gestion de Usuarios

El sistema debera manejar autenticacion y autorizacion por roles.

Roles esperados:

- Cliente.
- Encargado.
- Cocina.
- Administrador.

El cliente podra registrarse por si mismo. Los demas usuarios seran creados por el administrador.

Cada usuario debera poder gestionar su propia cuenta y cambiar su contrasena. Ningun usuario debe cambiar la contrasena de otro usuario.

### Gestion de Pedidos

El pedido podra ser realizado por un cliente o por un empleado.

Un pedido podra incluir:

- Uno o varios productos.
- Uno o varios combos.
- Cantidades.
- Observaciones de preparacion.
- Subtotales.
- Total.
- Impuestos.
- Metodo de entrega.

Estados esperados del pedido:

- Pendiente de pago.
- Aceptada.
- Preparacion.
- Procesando.
- Entregada.

### Procesamiento de Pagos

El sistema simulara pagos con:

- Tarjeta de credito.
- Tarjeta de debito.
- Efectivo.

Si el pago es en efectivo, se debe calcular el vuelto.

Si el pedido es para entrega a domicilio, se deben registrar datos de direccion y costo de envio.

### Gestion de Cocina y Preparacion

Cuando un pedido sea aceptado, pasara a cocina.

El sistema debe permitir controlar visualmente el estado de preparacion.

La preparacion debe contemplar:

- Estado del pedido.
- Hora de inicio.
- Hora de finalizacion.
- Observaciones.
- Tiempo de preparacion.

A futuro, el sistema puede incluir estaciones de cocina como:

- Barra.
- Reposteria.
- Bebidas frias.
- Empaque.

### Seguimiento de Pedidos

El cliente podra consultar el estado de su pedido y ver en que etapa se encuentra.

Los encargados y administradores podran consultar pedidos por fecha y estado.

### Historial de Pedidos

Los clientes podran ver su historial de pedidos.

Los encargados y administradores podran ver todos los pedidos y filtrarlos.

### Dashboard

El administrador y encargado tendran acceso a un dashboard con informacion general del negocio.

Indicadores requeridos:

- Tres productos con mayor cantidad de pedidos.
- Cantidad de pedidos por estado de la fecha actual.

## Alcance Tecnico

### Backend

El backend se desarrollara en PHP como API.

Cada entidad principal tendra:

```text
Controller.php
Model.php
```

Ejemplo:

```text
ProductoController.php
ProductoModel.php
CategoriaController.php
CategoriaModel.php
ComboController.php
ComboModel.php
MenuController.php
MenuModel.php
```

El `Controller` recibira la solicitud, llamara al `Model` y devolvera JSON.

El `Model` realizara las consultas a MySQL.

### Frontend

El frontend se desarrollara en React.

Cada modulo usara componentes y servicios:

```text
components/Cafeteria/
services/
```

Los servicios llamaran al backend usando Axios.

Ejemplo:

```text
CatalogProductos.jsx -> ProductosServices.js -> GET /producto
```

### Base de Datos

La base de datos principal sera:

```text
cafeteriaronroneo
```

Tablas principales:

- categoria.
- productos.
- menu.
- combos.
- comboproductos.
- rol.
- usuarios.
- clientes.
- carritos.
- carritoproductos.
- carritocombos.
- pedidos.
- detallepedidos.
- pagos.
- preparacion.

## Modulos Prioritarios

Para avanzar de forma ordenada, el desarrollo se dividira en etapas:

1. Conexion a base de datos.
2. Catalogo de productos.
3. Detalle de producto.
4. Categorias y filtros.
5. Menus disponibles.
6. Combos.
7. Usuarios y roles.
8. Carrito y pedidos.
9. Pagos.
10. Preparacion en cocina.
11. Seguimiento e historial.
12. Dashboard.

## Estado Actual del Proyecto

Actualmente el proyecto ya cuenta con una base inicial para:

- Backend PHP.
- Frontend React.
- Catalogo de productos.
- Detalle de productos.
- Servicios de productos.
- Imagenes en `uploads`.
- Base de datos `cafeteriaronroneo`.

Los endpoints principales de productos son:

```text
GET /producto
GET /producto/{id}
GET /producto/getByCategoria/{idCategoria}
```

## Criterio de Adaptacion Desde el Proyecto del Profesor

El proyecto del profesor ubicado en:

```text
C:\Users\angel\Downloads\apimovieFinal\apimovie
```

se usara como referencia para:

- Organizacion de carpetas.
- Separacion entre controllers y models.
- Uso de services en React.
- Enrutamiento mediante `RoutesController.php`.
- Uso de `index.php` como entrada principal del backend.
- Respuestas JSON desde el backend.

No se copiara el tema de peliculas. Solo se adaptara la arquitectura al negocio de cafeteria.

## Enfoque Academico

El proyecto debe poder explicarse claramente.

Por eso se prioriza:

- Codigo organizado.
- Nombres coherentes con el negocio.
- Separacion de responsabilidades.
- Explicacion paso a paso de cada modulo.
- Avances progresivos y documentados.

La meta no es solamente que funcione, sino que cada integrante pueda explicar que hace cada parte del sistema.
