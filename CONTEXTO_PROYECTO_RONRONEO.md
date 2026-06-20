# Contexto del Proyecto Cafeteria Ronroneo

Este documento resume el contexto tecnico y funcional del proyecto **Cafeteria Ronroneo**. Sirve como guia para continuar el desarrollo y como memoria para explicar el proyecto o retomarlo en otro chat.

## Objetivo

Crear una aplicacion web para la gestion de un servicio de comida tipo **cafeteria**, enfocado en productos, menus, combos, pedidos, pagos y preparacion en cocina.

El proyecto debe seguir una arquitectura similar al proyecto de referencia del profesor:

```text
C:\Users\angel\Downloads\apimovieFinal\apimovie
```

Ese proyecto del profesor se usa como molde de organizacion, no como copia de contenido.

## Tecnologias

- Backend: PHP 8.2.12 o superior.
- Base de datos: MySQL/MariaDB.
- Frontend: React 19 o superior.
- Servidor local: XAMPP.
- Editor: Visual Studio Code.
- Control de versiones: Git.

## Arquitectura Usada

El proyecto sigue una mezcla de:

- MVC.
- Front Controller.
- API REST sencilla.
- Arquitectura por capas.

Flujo general:

```text
React Component
->
Service.js
->
URL del backend
->
index.php
->
RoutesController.php
->
Controller.php
->
Model.php
->
MySQL
```

Comparacion con C# por capas:

```text
React Component = pantalla o formulario
Service.js = clase que llama al backend
Controller.php = coordinador, parecido a una BLL ligera
Model.php = acceso a datos, parecido a DAL
MySQL = base de datos
```

## Estructura del Proyecto

Estructura principal esperada:

```text
ProyectoCafeteriaRonroneo-master/
|-- index.php
|-- config.php
|-- routes/
|   `-- RoutesController.php
|-- controllers/
|   |-- ProductoController.php
|   |-- CategoriaController.php
|   |-- ComboController.php
|   |-- MenuController.php
|   `-- core/
|-- models/
|   |-- ProductoModel.php
|   |-- CategoriaModel.php
|   |-- ComboModel.php
|   `-- MenuModel.php
|-- database/
|   `-- cafeteriaronroneo.sql
|-- uploads/
`-- ProyectoCafeteriaRonroneo/
    |-- .env
    `-- src/
        |-- components/
        `-- services/
```

## Backend PHP

El backend es una API. No debe encargarse de dibujar pantallas. Su trabajo es responder datos en JSON.

Entrada principal:

```text
index.php
```

Este archivo carga:

- Configuracion.
- Conexion MySQL.
- Modelos.
- Controladores.
- Router.

Ejemplo de flujo con productos:

```text
GET /producto
->
index.php
->
RoutesController.php
->
ProductoController.php
->
ProductoModel.php
->
tabla productos
```

## Frontend React

React es la parte visual. Muestra pantallas, tarjetas, menus, botones, formularios y detalles.

Los componentes de React no deben consultar MySQL directamente. Deben usar servicios.

Ejemplo:

```text
CatalogProductos.jsx
->
ProductosServices.js
->
GET http://localhost:81/ProyectoCafeteriaRonroneo-master/producto
```

## Configuracion Local

En React:

```text
ProyectoCafeteriaRonroneo/.env
```

Valor local actual:

```env
VITE_BASE_URL=http://localhost:81/ProyectoCafeteriaRonroneo-master/
```

En PHP:

```text
config.php
```

Debe apuntar a la base:

```php
'DB_DBNAME' => 'cafeteriaronroneo'
```

Si XAMPP usa root sin contrasena, ajustar:

```php
'DB_PASSWORD' => ''
```

Si MySQL usa contrasena, dejar la que corresponda.

## Base de Datos

Base principal:

```text
cafeteriaronroneo
```

Tablas principales:

```text
categoria
productos
menu
combos
comboproductos
rol
usuarios
clientes
carritos
carritoproductos
carritocombos
pedidos
detallepedidos
pagos
preparacion
```

Agrupacion funcional:

```text
Catalogo:
- categoria
- productos
- menu
- combos
- comboproductos

Usuarios:
- rol
- usuarios
- clientes

Compra:
- carritos
- carritoproductos
- carritocombos
- pedidos
- detallepedidos
- pagos

Cocina:
- preparacion
```

## Endpoints Iniciales

Productos:

```text
GET /producto
GET /producto/{id}
GET /producto/getByCategoria/{idCategoria}
```

Categorias:

```text
GET /categoria
GET /categoria/{id}
```

Combos:

```text
GET /combo
GET /combo/{id}
```

Menus:

```text
GET /menu
GET /menu/{id}
```

## Estado Actual de Productos

Los `GET` de productos ya deben devolver datos suficientes para las pantallas de React.

`GET /producto` devuelve productos con categoria:

```sql
SELECT p.*, c.Nombre AS Categoria
FROM productos p
INNER JOIN categoria c ON p.IdCategoria = c.IdCategoria;
```

Esto permite que la card de React use:

```js
item.Nombre
item.Descripcion
item.Imagen
item.Precio
item.Categoria
```

## Requisitos Funcionales del Enunciado

El sistema debe cubrir progresivamente:

- Pagina de inicio con introduccion al negocio.
- Menu disponible visible para cualquier usuario.
- Dashboard para administrador y encargado.
- Autenticacion y autorizacion por roles.
- Roles: Cliente, Encargado, Cocina y Administrador.
- Registro propio para clientes.
- Creacion de usuarios internos solo por administrador.
- Gestion de productos por administrador.
- Gestion de combos por administrador.
- Gestion de menus por administrador.
- Visualizacion de menu agrupado por categoria.
- Filtro por categoria.
- Gestion del proceso de preparacion.
- Gestion de cocina por estaciones.
- Pedidos realizados por cliente o empleado.
- Estados de pedido.
- Procesamiento/simulacion de pagos.
- Confirmacion de pedido.
- Seguimiento de pedidos.
- Historial de pedidos.

## Roles Esperados

```text
Cliente:
- Registrarse.
- Ver menu.
- Crear pedido.
- Pagar pedido.
- Ver seguimiento.
- Ver historial.

Encargado:
- Gestionar pedidos.
- Ver dashboard.
- Filtrar pedidos.

Cocina:
- Ver pedidos aceptados.
- Gestionar preparacion.
- Cambiar estados de preparacion.

Administrador:
- Gestionar usuarios.
- Gestionar productos.
- Gestionar combos.
- Gestionar menus.
- Ver dashboard.
```

## Prioridad de Desarrollo Recomendada

1. Asegurar conexion a base de datos.
2. Productos: listar, detalle y filtro por categoria.
3. Categorias: listar y usar en filtros.
4. Menu disponible.
5. Combos.
6. Usuarios y login.
7. Pedidos y carrito.
8. Pagos.
9. Preparacion/cocina.
10. Dashboard.

## Como Probar el Backend

Con XAMPP encendido:

```text
Apache: Start
MySQL: Start
```

Probar en navegador:

```text
http://localhost:81/ProyectoCafeteriaRonroneo-master/producto
http://localhost:81/ProyectoCafeteriaRonroneo-master/producto/1
http://localhost:81/ProyectoCafeteriaRonroneo-master/producto/getByCategoria/1
```

Si se usa otro puerto, ajustar la URL.

## Como Probar el Frontend

Entrar a la carpeta React:

```powershell
cd C:\xampp\htdocs\ProyectoCafeteriaRonroneo-master\ProyectoCafeteriaRonroneo
npm run dev
```

Abrir la URL que indique Vite, usualmente:

```text
http://localhost:5173
```

## Nota Para Futuro Chat Con Codex

Si se pierde el chat, usar este contexto:

```text
Estoy trabajando en Cafeteria Ronroneo, un proyecto React + PHP + MySQL con XAMPP.
Usar como referencia el proyecto del profesor en:
C:\Users\angel\Downloads\apimovieFinal\apimovie

Ese proyecto usa:
React Component -> Service.js -> URL -> index.php -> RoutesController.php -> Controller.php -> Model.php -> MySQL.

Quiero adaptar Ronroneo con la misma arquitectura, pero con entidades de cafeteria:
productos, categorias, combos, menu, usuarios, clientes, pedidos, pagos y preparacion.
Explicame paso a paso y revisa la estructura antes de cambiar archivos.
```


