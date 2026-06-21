# Bitácora de Desarrollo y Enfoque Técnico: Aqua Manjar

Este documento resume el progreso técnico, las soluciones implementadas y el enfoque estratégico adoptado durante el desarrollo del frontend de **Aqua Manjar**.

---

## Actualización Reciente: Avance 3, Combos y Cocina

### N. Listados y Detalles del Avance 3
*   **Problema:** El Avance 3 requería listados y detalles de productos, combos, menús y procesos de preparación, pero el proyecto solo tenía catálogo general y módulos administrativos.
*   **Solución:**
    *   `ProductDetailPage.jsx` consume `get_product_detail.php` para mostrar nombre, descripción, ingredientes, categoría, imagen y precio.
    *   `ComboDetailPage.jsx` consume `get_combo_detail.php` para mostrar nombre, precio y productos internos del combo.
    *   `MenusPage.jsx` consume `get_menus_public.php` para listar menús y mostrar el menú disponible agrupable por categoría.
    *   `PreparationProcessesPage.jsx` consume `get_preparation_processes.php` para listar procesos y detallar estaciones ordenadas.
*   **Justificación:** Cumple el enfoque del Avance 3 sin usar datos quemados en React; toda la información sale de MySQL por endpoints PHP.

### O. Corrección de Gestión de Combos
*   **Problema:** Los combos podían crearse sin guardar productos en `combo_products`, el selector de categoría no mostraba opciones y las imágenes quedaban solo como nombre de archivo sin subirse a `uploads/products`.
*   **Solución:**
    *   `get_categories.php` ahora devuelve `type` para poder filtrar categorías de tipo `COMBO`.
    *   `AdminCombosPage.jsx` envía `FormData` con imagen y arreglo de productos.
    *   `manage_combos.php` sube la imagen, valida productos internos, guarda cantidades y rechaza combos vacíos.
    *   Al editar un combo, se reparan tareas de cocina faltantes para órdenes previas que quedaron aceptadas o en preparación.
*   **Justificación:** Un combo sin `combo_products` no puede entrar al monitor de cocina. Esta corrección hace que el combo sea una entidad completa y operativa.

### P. Carrito Robusto para Productos y Combos
*   **Problema:** Productos y combos pueden compartir el mismo ID numérico en tablas distintas. El carrito comparaba solo por `id`, por lo que `product-8` podía confundirse con `combo-8`.
*   **Solución:** `CartContext.jsx` genera una llave lógica `tipo-id` (`product-8`, `combo-8`, `custom-*`) para agregar, actualizar y eliminar ítems.
*   **Justificación:** Evita colisiones en `localStorage`, errores al pagar y pérdidas de identidad entre productos y combos.

### Q. Respaldo de Tracking de Cocina
*   **Problema:** Si el trigger `tg_after_update_order_status` no existía, estaba desactualizado o el combo estaba mal configurado, las órdenes no aparecían en `KitchenPage`.
*   **Solución:** `process_order.php` ejecuta `ensureOrderItemTracking(order_id)` después de aceptar la orden. Esta función crea tareas faltantes para productos y combos sin duplicarlas.
*   **Justificación:** Mantiene el flujo operativo aunque la base importada tenga diferencias con el script actual.

## 1. Resoluciones Técnicas Críticas

### A. Solución al Error de Análisis de Importación (Vite)
*   **Problema:** Se presentaba el error `[plugin:vite:import-analysis] Failed to resolve import`, causado por intentar importar una carpeta de imágenes directamente en el código de React.
*   **Solución:** Se eliminó la importación modular y se migró el almacenamiento de imágenes a la carpeta `/public/uploads/products/`. 
*   **Justificación:** En Vite, los archivos en la carpeta `public` se sirven como recursos estáticos en la raíz del servidor, permitiendo el acceso mediante rutas de URL (ej. `/uploads/products/imagen.png`) sin violar las restricciones de seguridad del navegador.

### B. Localización y Formateo de Moneda (CRC)
*   **Problema:** Los precios se mostraban con formatos inconsistentes (ej. `12.5` o `15.4`) o carecían de separadores de miles adecuados para la moneda nacional.
*   **Solución:** Implementación de `Intl.NumberFormat` con configuración regional `es-CR` y moneda `CRC`.
*   **Configuración Aplicada:** 
    *   Símbolo automático: `₡`.
    *   Separadores de miles: Puntos (ej. `7.500`).
    *   Decimales: Configurados en `0` (`minimumFractionDigits: 0`) para mantener la limpieza visual típica de los precios en colones.
*   **Justificación:** En Vite, los archivos en la carpeta `public` se sirven como recursos estáticos en la raíz del servidor, permitiendo el acceso mediante rutas de URL (ej. `/uploads/products/imagen.png`) sin violar las restricciones de seguridad del navegador.

### C. Sincronización de Hashes y Seguridad del Servidor
*   **Problema:** El login fallaba debido a que los hashes generados externamente no eran compatibles con la función `password_verify()` del entorno local XAMPP (PHP 8.2).
*   **Solución:** Se delegó la generación del hash exclusivamente al Modelo (`User.php`) usando la función nativa `password_hash()`. Se implementó un script de utilidad (`fix_admin.php`) para recalibrar la cuenta del Administrador con un hash generado por el propio servidor.
*   **Justificación:** Garantiza que el sistema sea autosuficiente en la gestión de credenciales, eliminando la dependencia de generadores externos y asegurando compatibilidad total entre la creación y verificación de usuarios.

### D. Optimización de Rutas de Fondo (Hero Section)
*   **Problema:** La imagen de fondo del Hero se mostraba blanca o no cargaba debido a rutas absolutas incorrectas en el CSS.
*   **Solución:** Se corrigió la ruta en `App.css` para usar una referencia relativa `./assets/aquaManjarBgrnd.png` que Vite puede procesar y empaquetar correctamente desde la carpeta `src`.

### E. Consolidación de Endpoints Administrativos
*   **Problema:** Dispersión de archivos de backend y carpetas inexistentes que complicaban el mantenimiento.
*   **Solución:** Se centralizaron los puntos de entrada en `backend/public/`, manteniendo la lógica de negocio en `UserController` y `User.php`.
*   **Justificación:** Respeta el patrón de diseño MVC (Modelo-Vista-Controlador), donde el frontend solo conoce la capa pública y el controlador gestiona el flujo de datos hacia el modelo.

### F. Categorización Dinámica
*   **Problema:** Los botones de filtro en el menú estaban "hardcoded" (fijos en el código), lo que obligaba a editar React cada vez que se agregaba una categoría.
*   **Solución:** Se implementó `get_categories.php` y se vinculó al `useEffect` principal. Ahora la barra de filtros se construye a partir de los registros reales de la tabla `categories`.
*   **Justificación:** Aumenta la escalabilidad del negocio, permitiendo al administrador expandir el catálogo sin intervención técnica.

---

### G. Estabilización de Layout y Prevención de Crashes (Pantalla Blanca)
*   **Problema:** Errores de `ReferenceError: DispatchPage is not defined` y fallos en el renderizado por datos nulos en `localStorage` o base de datos.
*   **Solución:** 
    *   Implementación de *Null Checks* y valores por defecto (`|| ''`) en los mapeos de `App.jsx`.
    *   Parseo seguro de JSON en `Navbar.jsx` con bloques `try-catch`.
    *   Importación explícita de componentes de ruta en `App.jsx`.
*   **Justificación:** Evita que errores menores en los datos rompan todo el árbol de componentes de React, mejorando la robustez de la aplicación.

### H. Estación de Despacho y RBAC en Navbar
*   **Problema:** El personal operativo no tenía un flujo claro tras terminar la cocina y el menú de navegación era exclusivo para el administrador.
*   **Solución:** 
    *   Creación de `DispatchPage.jsx` y endpoints en `backend/public/` para gestión de entregas.
    *   Rediseño del Navbar con menús desplegables profesionales, iconos SVG y lógica de acceso para roles 1 (Admin), 2 (Encargado) y 3 (Cocina).
*   **Justificación:** Cumple con el requerimiento de estaciones de trabajo independientes (KDS) y mejora la UX para el personal interno.

### I. Corrección Estructural de CSS
*   **Problema:** El Footer se desplazaba hacia la parte superior cuando las páginas tenían poco contenido.
*   **Solución:** Uso de `min-height: 100vh` en el contenedor principal y `flex: 1` en el envoltorio de contenido (`content-wrap`).

### G. Estabilización de Layout y Prevención de Crashes (Pantalla Blanca)
*   **Problema:** Errores de ejecución y fallos en el renderizado por datos nulos en `localStorage` o archivos de activos (Logo) faltantes.
*   **Solución:** 
    *   Implementación de *Null Checks* y valores por defecto (`|| ''`) en los mapeos de `App.jsx`.
    *   Parseo seguro de JSON en `Navbar.jsx` con bloques `try-catch`.
    *   Importación modular del logo para validación en tiempo de compilación.
*   **Justificación:** Evita que errores menores en los datos rompan todo el árbol de componentes de React, asegurando la disponibilidad de la plataforma.

### H. Estación de Despacho y RBAC en Navbar
*   **Problema:** El personal operativo no tenía un flujo claro tras terminar la cocina y el menú de navegación era exclusivo para el administrador.
*   **Solución:** 
    *   Creación de `DispatchPage.jsx` y endpoints en `backend/public/` para gestión de entregas finales.
    *   Rediseño del Navbar con menús desplegables profesionales, iconos SVG y lógica de acceso para roles 1 (Admin), 2 (Encargado) y 3 (Cocina).
*   **Justificación:** Cumple con el requerimiento de estaciones de trabajo independientes (KDS/Dispatch) y mejora la UX del personal interno.

### I. Corrección Estructural de CSS (Sticky Footer)
*   **Problema:** El Footer se desplazaba hacia la parte superior de la pantalla cuando las páginas tenían poco contenido.
*   **Solución:** Uso de `min-height: 100vh` en el contenedor principal y `flex: 1` en el envoltorio de contenido (`content-wrap`).

## 2. Estado de Rutas y Arquitectura de la API
*   **Centralización Operativa:** Todos los puntos de entrada de la API (`update_order_status.php`, `get_ready_orders.php`, `update_item_status.php`) se han consolidado en `backend/public/`. 
*   **Seguridad de Rutas:** Se ajustaron las referencias de base de datos (`require_once`) para operar correctamente desde la carpeta pública, siguiendo el patrón de diseño MVC.

### J. Ciclo de Vida del Pedido (Full Stack)
1. **Cocina:** Control de ítems individuales por sección, permitiendo rastrear el progreso detallado.
2. **Automatización:** El motor de base de datos (Triggers) promueve la orden al estado `'Procesando'` de forma asíncrona.
3. **Despacho:** Gestión logística final según el método de entrega solicitado.

*   **Centralización Operativa:** Todos los puntos de entrada de la API (`update_order_status.php`, `get_ready_orders.php`, `update_item_status.php`) se han consolidado en `backend/public/`. 
*   **Seguridad de Rutas:** Se ajustaron las referencias de base de datos (`require_once`) para operar correctamente desde la carpeta pública, siguiendo el patrón de diseño MVC.
*   **Limpieza de Código:** Se eliminaron los archivos redundantes en la raíz del proyecto para centralizar la lógica y evitar ejecuciones accidentales de scripts obsoletos.

### J. Ciclo de Vida del Pedido (Full Stack)
1. **Cocina:** Se implementó el control de ítems individuales por estación, permitiendo que el Trigger de MySQL detecte la finalización de la orden.
2. **Automatización:** La orden transita al estado `'Procesando'` sin intervención manual cuando el último plato está listo.
3. **Despacho:** Interfaz dedicada que gestiona la logística final según el método de entrega (Express con dirección o Mostrador).
4. **Cierre:** La actualización al estado `'Entregada'` se sincroniza en tiempo real con el componente de seguimiento del cliente (`TrackingPage`).

## 3. Avances de Calidad de Software
1.  **Manejo de Errores en Fetch:** En `App.jsx` y `DispatchPage.jsx` se implementaron bloques `try-catch` y validaciones `response.ok` para prevenir el colapso de la aplicación ante fallos del servidor.
2.  **Seguridad en Renderizado:** Se añadieron validaciones de existencia de datos antes de aplicar métodos de cadena (`toLowerCase`, `includes`), eliminando por completo el error de "Pantalla Blanca".
2.  **Arquitectura de Componentes:** Uso de `CartContext` para la gestión global del carrito y persistencia en `localStorage` para evitar la pérdida de datos al recargar.
3.  **Gestión de Roles (RBAC):** Se implementó una lógica de seguridad donde solo los usuarios con `role_id == 1` (Administrador) pueden visualizar y acceder a la página de gestión de usuarios.


## 3. Estado de Activos (Imágenes)
*   **Ubicación:** `frontend/public/uploads/products/` para productos y `frontend/src/assets/` para elementos de diseño de la interfaz.
*   **Convención de Nombres:** Nombres en minúsculas y sin espacios (ej. `cevichetropical.png`) para evitar errores de resolución en servidores sensibles a mayúsculas/minúsculas.


## 4. Manual de Migración Impecable
Para mover el proyecto a una nueva estación de trabajo:
1.  **Base de Datos**: Importar el archivo `database/init.sql` en phpMyAdmin. Este script recreará las 16 tablas y los triggers automáticos.
2.  **Carpeta de Imágenes**: Asegurarse de que exista la ruta `frontend/public/uploads/products/` y que el servidor tenga permisos de escritura en ella.
3.  **Configuración del Servidor**: Si el puerto de Apache cambia (ej. de 81 a 80), se debe actualizar la constante `API_BASE_URL` en los componentes de React para evitar errores de conexión.
4.  **Limpieza**: Eliminar los archivos `update_order_status.php` y `get_ready_orders.php` que se encuentran en la raíz del proyecto para evitar ejecuciones de código obsoletas.

**Desarrollador:** Yanfret Cruz Jiménez  
**Fecha de Actualización:** Junio, 2026  
**Proyecto:** Aqua Manjar - Fusión Gastronómica Multicultural
```


### G. Robustez del Sistema y Prevención de Fallos (Pantalla Blanca)
*   **Problema:** Errores de `ReferenceError` y fallos en el renderizado por datos nulos en `localStorage` o archivos de activos faltantes.
*   **Solución:** 
    *   Implementación de *Null Checks* y valores por defecto en los mapeos de `App.jsx`.
    *   Parseo seguro de JSON en `Navbar.jsx` con bloques `try-catch`.
    *   Gestión de importaciones explícitas de componentes de ruta en `App.jsx`.
*   **Justificación:** Se garantiza que el sistema sea resiliente, evitando que errores de datos interrumpan la experiencia del usuario.

### H. Estación de Despacho y RBAC en Navbar
*   **Problema:** Ausencia de una interfaz para la logística de salida y falta de opciones de navegación para perfiles operativos.
*   **Solución:** 
    *   Desarrollo del módulo `DispatchPage` para la gestión de entregas finales.
    *   Implementación de menús desplegables inteligentes en el Navbar basados en roles (Admin, Encargado, Cocina).
*   **Justificación:** Se optimiza el flujo de trabajo operativo, separando las responsabilidades de preparación y entrega final.

### I. Arquitectura de API y Limpieza de Proyecto
*   **Centralización Operativa:** Todos los puntos de entrada de la API (`update_order_status.php`, `get_ready_orders.php`, `update_item_status.php`) se han consolidado en `backend/public/`. 
*   **Seguridad de Rutas:** Se ajustaron las referencias de base de datos (`require_once`) para operar correctamente desde la carpeta pública, siguiendo el patrón de diseño MVC.
*   **Limpieza de Código:** Se eliminaron los archivos redundantes en la raíz del proyecto para centralizar la lógica y evitar ejecuciones accidentales de scripts obsoletos.

### J. Ciclo de Vida del Pedido (Full Stack)
1. **Cocina:** Control de ítems individuales por sección, permitiendo rastrear el progreso detallado.
2. **Automatización:** El motor de base de datos (Triggers) promueve la orden al estado `'Procesando'` de forma asíncrona.
3. **Despacho:** Gestión logística diferenciada según el método de entrega solicitado (Express o Mostrador).
4. **Seguimiento:** El cliente visualiza la transición de estados en tiempo real mediante un sistema de seguimiento reactivo.

### K. Consolidación de Pagos y Pasarela (Checkout)
*   **Problema:** `process_order.php` enviaba el monto entregado (`amount_tendered`) siempre en 0, lo que causaba un fallo de integridad con el trigger `tg_before_insert_payments` al seleccionar pago en Efectivo. Además, no se simulaba el cobro por tarjeta.
*   **Solución:** Se rediseñó la fase final de `CartPage.jsx` para mostrar un input de "Monto Entregado" (con cálculo de vuelto en vivo) o campos simulados de tarjeta que envían los últimos 4 dígitos al servidor.
*   **Justificación:** Cierra el ciclo financiero de la aplicación de manera estricta y evita el colapso transaccional de MySQL.

### L. Módulo de Menús y Exposición Condicional
*   **Problema:** El catálogo principal mostraba todos los productos sin restricciones, ignorando la regla de disponibilidad por menús. No había interfaz para gestionar dichos menús.
*   **Solución:** 
    *   Creación de `AdminMenusPage.jsx` y `manage_menus.php` para gestionar nombres, horarios y vinculación de platos/combos.
    *   Modificación de `get_products.php` para utilizar `INNER JOIN` con `menus` garantizando que solo los ítems asignados a un menú `is_active = TRUE` en el rango de tiempo actual sean expuestos. Se utilizó `UNION ALL` para unificar combos y productos regulares.
    *   Implementación de "Modo Administrador" (`?admin=true`) para saltarse este filtro al momento de asignar o editar platos en el backend.

### M. Corrección de Bug de Foránea (Combos y Categorías)
*   **Problema:** Al intentar comprar el Combo Familiar Marino daba un error de clave foránea. También al editar un plato fallaba la categoría.
*   **Solución:** El combo estaba erróneamente guardado en la tabla `products`; se migró físicamente a la tabla `combos` y se modificó `init.sql`. Para el error de categorías, se incluyó `p.category_id` en la consulta SQL de `get_products.php` ya que React lo enviaba como `undefined`.

<!--
[PROMPT_SUGGESTION]¿Cómo modifico el useEffect en App.jsx para usar getProducts y cargar datos reales de MySQL?[/PROMPT_SUGGESTION]
[PROMPT_SUGGESTION]¿Cómo puedo añadir un buscador por texto para encontrar platos específicos rápidamente?[/PROMPT_SUGGESTION]
->
