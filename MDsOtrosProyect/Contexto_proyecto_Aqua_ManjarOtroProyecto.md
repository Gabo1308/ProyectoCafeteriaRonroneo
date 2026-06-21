# Especificación y Contexto Técnico Exhaustivo: Aqua Manjar (Grupo #14)

Este documento condensa el pliego de requerimientos oficiales del proyecto y el diseño físico de la base de datos. Sirve como directriz de contexto absoluta para que el agente de IA asista en la arquitectura, lógica de componentes y endpoints, garantizando el cumplimiento estricto de la rúbrica y la consistencia del código.

---

## 1. Lineamientos Técnicos y de Gestión Obligatorios
*   **Backend:** API RESTful modular desarrollada en **PHP versión 8.2.12** o superior[cite: 2, 6].
*   **Base de Datos:** **MySQL 8.0** o superior (Motor InnoDB, cotejamiento `utf8mb4_unicode_ci`)[cite: 2, 5].
*   **Frontend:** **React versión 19.1.1** o superior, implementando hooks modernos y patrones limpios de diseño[cite: 2, 6].
*   **Arquitectura:** Separación rigurosa de responsabilidades, modularidad, componentes reutilizables y organización estructurada en capas[cite: 6].
*   **Obsolescencia:** Queda prohibido el uso de librerías, dependencias o funciones marcadas como *deprecated* o fuera de soporte activo[cite: 2, 6].
*   **Control de Versiones:** Repositorio oficial en **GitHub**, evidenciando un historial progresivo, commits atómicos y manejo limpio de ramas por el desarrollador (Yanfret Cruz Jiménez)[cite: 1, 2, 6].
*   **Rol de la IA:** El agente de IA debe actuar exclusivamente como un asistente de codificación educativo y consultor arquitectónico. El código generado debe ser totalmente transparente, legible y estructurado para permitir su completa comprensión y defensa académica oral sin excepciones[cite: 6].

---

## 2. Esquema Físico de Base de Datos Real (`aqua_manjar_db`)
El sistema cuenta con las siguientes **16 tablas**, estructuradas con restricciones referenciales `ON DELETE RESTRICT ON UPDATE CASCADE` donde aplique[cite: 2]:

### Módulo 1: Gestión de Usuarios y Autenticación
1.  **`roles`**: (`id` INT PK AI, `name` VARCHAR(30) UNIQUE)[cite: 2]. Valores semilla obligatorios: `'Administrador'`, `'Encargado'`, `'Cocina'`, `'Cliente'`[cite: 2].
2.  **`users`**: (`id` INT PK AI, `name` VARCHAR(100), `email` VARCHAR(150) UNIQUE, `password` VARCHAR(255) [Hash], `phone` VARCHAR(20), `role_id` FK -> `roles.id`, `reset_token` VARCHAR(100) NULL)[cite: 2].

### Módulo 2: Catálogo, Categorías e Ingredientes
3.  **`categories`**: (`id` INT PK AI, `name` VARCHAR(50) UNIQUE, `type` ENUM('PRODUCTO', 'COMBO', 'GENERAL'))[cite: 2].
4.  **`products`**: (`id` INT PK AI, `name` VARCHAR(100) UNIQUE, `description` TEXT, `price` DECIMAL(10,2) CHECK >= 0, `category_id` FK -> `categories.id`, `image_url` VARCHAR(255))[cite: 2].
5.  **`ingredients`**: (`id` INT PK AI, `name` VARCHAR(50) UNIQUE)[cite: 2].
6.  **`product_ingredients`**: (PK Compuesta por `product_id` FK -> `products.id` [ON DELETE CASCADE] y `ingredient_id` FK -> `ingredients.id`)[cite: 2].
7.  **`combos`**: (`id` INT PK AI, `name` VARCHAR(100) UNIQUE, `description` TEXT, `special_price` DECIMAL(10,2) CHECK >= 0, `category_id` FK -> `categories.id`, `image_url` VARCHAR(255))[cite: 2].
8.  **`combo_products`**: (PK Compuesta por `combo_id` FK -> `combos.id` [ON DELETE CASCADE] y `product_id` FK -> `products.id`, `quantity` INT DEFAULT 1 CHECK > 0)[cite: 2].

### Módulo 3: Gestión de Menús y Reglas de Disponibilidad
9.  **`menus`**: (`id` INT PK AI, `name` VARCHAR(100), `start_date` DATE, `end_date` DATE, `start_time` TIME, `end_time` TIME, `is_active` BOOLEAN DEFAULT FALSE)[cite: 2]. *Restricción:* `end_date >= start_date`[cite: 2].
10. **`menu_items`**: (`id` INT PK AI, `menu_id` FK -> `menus.id` [ON DELETE CASCADE], `product_id` FK -> `products.id` NULL, `combo_id` FK -> `combos.id` NULL)[cite: 2].
    *   *Restricción Arc (XOR):* `CONSTRAINT chk_menu_item_type` obliga a que un ítem apunte a un producto O a un combo de manera exclusiva, nunca a ambos ni nulos[cite: 2].
    *   *Índices Únicos:* `uq_menu_product(menu_id, product_id)` y `uq_menu_combo(menu_id, combo_id)` para evitar duplicados dentro del mismo menú[cite: 2].

### Módulo 4: Estaciones y Rutas Operativas de Cocina
11. **`stations`**: (`id` INT PK AI, `name` VARCHAR(50) UNIQUE)[cite: 2]. Valores semilla obligatorios: `'Barra'`, `'Estación Caliente'`, `'Estación Fría'`, `'Estación de Guarniciones'`, `'Estación de Emplatado'`[cite: 2].
12. **`product_preparation_steps`**: (PK Compuesta por `product_id` FK -> `products.id` [ON DELETE CASCADE] y `station_id` FK -> `stations.id`, `step_order` INT CHECK > 0)[cite: 2].
    *   *Índice Único:* `uq_product_step(product_id, step_order)` garantiza una secuencia lineal ordenada y sin colisiones de pasos[cite: 2].

### Módulo 5: Pedidos, Detalles, Seguimiento y Pagos
13. **`orders`**: (`id` INT PK AI, `client_id` FK -> `users.id`, `employee_id` FK -> `users.id` NULL [ON DELETE SET NULL], `status` ENUM('Pendiente de pago', 'Aceptada', 'Preparación', 'Procesando', 'Entregada') DEFAULT 'Pendiente de pago', `delivery_method` ENUM('Entrega a domicilio', 'Recogida en tienda'), `delivery_address` TEXT NULL, `shipping_cost` DECIMAL(10,2) DEFAULT 0.00, `subtotal` DECIMAL(10,2) DEFAULT 0.00, `tax` DECIMAL(10,2) DEFAULT 0.00, `total` DECIMAL(10,2) DEFAULT 0.00)[cite: 2].
14. **`order_details`**: (`id` INT PK AI, `order_id` FK -> `orders.id` [ON DELETE CASCADE], `product_id` FK -> `products.id` NULL, `combo_id` FK -> `combos.id` NULL, `quantity` INT CHECK > 0, `notes` TEXT NULL, `unit_price` DECIMAL(10,2))[cite: 2].
    *   *Restricción Arc (XOR):* `CONSTRAINT chk_order_detail_type` obliga a definir un producto O un combo de forma única por línea[cite: 2].
15. **`order_item_tracking`**: (`id` INT PK AI, `order_detail_id` FK -> `order_details.id` [ON DELETE CASCADE], `station_id` FK -> `stations.id`, `step_order` INT, `status` ENUM('Cola', 'En Preparación', 'Completado') DEFAULT 'Cola', `started_at` DATETIME NULL, `completed_at` DATETIME NULL)[cite: 2].
16. **`payments`**: (`id` INT PK AI, `order_id` INT NOT NULL UNIQUE FK -> `orders.id`, `payment_method` ENUM('Tarjeta de crédito', 'Tarjeta de débito', 'Efectivo'), `amount_tendered` DECIMAL(10,2) NULL, `change_given` DECIMAL(10,2) NULL, `card_last_four` VARCHAR(4) NULL, `transaction_status` VARCHAR(30) DEFAULT 'Aprobado', `paid_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP)[cite: 2].
    *   *Relación 1:1:* Modela la unicidad a través del índice `UNIQUE(order_id)`[cite: 2].

---

## 3. Lógica Funcional y Reglas de Negocio Requeridas

### Módulo de Interfaces y Visualización General
*   **Página de Inicio:** Acceso público. Muestra una introducción formal al restaurante multicultural Aqua Manjar y renderiza el catálogo filtrado por el menú que esté disponible en tiempo real[cite: 1, 6].
*   **Ordenamiento del Menú:** Debe mostrarse agrupado por categorías y permitir el filtrado dinámico en React[cite: 6].
*   **Listados y Detalles del Avance 3:** El sistema cuenta con vistas públicas para detalle de producto (`ProductDetailPage`), detalle de combo (`ComboDetailPage`), menú disponible/listado de menús (`MenusPage`) y procesos de preparación (`PreparationProcessesPage`). Todas consumen endpoints PHP y datos de MySQL, sin información quemada.
*   **Diseño Visual:** Estética limpia alusiva a "Aqua Manjar" cuidando los principios normativos de usabilidad y experiencia de usuario (UX/UI)[cite: 1, 6].
*   **Estación de Despacho:** Interfaz operativa para la entrega final. Filtra órdenes en estado `'Procesando'` (listas tras cocina) y permite marcarlas como `'Entregada'`.
*   **Diseño de Layout:** Implementación de un contenedor flexible (`flex-grow`) que garantiza la persistencia del Footer en la base de la ventana independientemente del volumen de contenido.

### Módulo de Usuarios y Control de Accesos (RBAC)
*   **Autenticación:** El Cliente puede autorregistrarse[cite: 6]. Los perfiles Encargado, Cocina y Administrador solo pueden ser dados de alta por el Administrador[cite: 6].
*   **Perfil Autogestionable:** Cada usuario modifica sus datos básicos y actualiza su propia contraseña de forma exclusiva (aislamiento estricto de cuentas)[cite: 6].
*   **Flujo de Recuperación:** Mecanismo "Olvidé mi contraseña" genera un token temporal (`reset_token`), se despacha vía correo electrónico y faculta la redirección segura para forzar el cambio de credenciales[cite: 2, 6].
*   **Flujo Automático de Estados de Orden:** El estado progresa de manera controlada bajo la secuencia: `Pendiente de pago` $\rightarrow$ `Aceptada` $\rightarrow$ `Preparación` $\rightarrow$ `Procesando` $\rightarrow$ `Entregada`[cite: 2, 6].
    *   **Sincronización Automática (Trigger):** El motor MySQL integra un disparador que detecta la finalización de tareas en cocina; al completarse el 100% de los platos, el estado de la orden global transmuta automáticamente a `'Procesando'`.

### Módulo Administrativo (CRUDs de Control)
*   **Gestión de Productos:** Restringido al Administrador[cite: 6]. Permite definir nombre único, descripción, selección múltiple de ingredientes predefinidos (mediante la tabla asociativa), asignación de categorías e imágenes representativas[cite: 2, 6].
*   **Gestión de Combos:** Creación de paquetes promocionales (1 o más productos) con un precio especial unificado. En el catálogo principal se exponen como un ítem único consolidado bajo una categoría de combo[cite: 6].
    *   Los combos se administran desde `AdminCombosPage.jsx` y `manage_combos.php`.
    *   La imagen se sube con `multipart/form-data` a `frontend/public/uploads/products/`.
    *   La composición se guarda en `combo_products` con `product_id` y `quantity`.
    *   El backend rechaza combos sin productos válidos.
    *   Si se edita un combo ya comprado, `manage_combos.php` ejecuta una reparación de tracking para órdenes aceptadas o en preparación que todavía no tengan filas de cocina.
*   **Gestión de Menús:** Permite agendar la vigencia por rango de fechas y horas[cite: 6]. **Regla de oro:** Solo un menú puede estar marcado con `is_active = TRUE` en un momento dado[cite: 2, 6]. Los productos y combos inyectados en dicho menú heredan de forma estricta sus ventanas temporales de exposición[cite: 6].

### Módulo Operativo de Cocina en Tiempo Real
*   **Ruta de Preparación:** El Administrador o Cocina asignan a cada producto la secuencia exacta de estaciones físicas (`product_preparation_steps`) por las que debe circular de forma lineal[cite: 2, 6].
*   **Regla para Combos:** Un combo no tiene ruta propia. Sus tareas de cocina se generan expandiendo sus productos internos desde `combo_products`; por eso cada producto del combo debe tener pasos en `product_preparation_steps`.
*   **Pantalla de Cocina:** Página de inicio obligatoria para los usuarios de Cocina[cite: 6]. Permite filtrar por una estación específica de trabajo o desplegar la cuadrícula unificada de todas las estaciones[cite: 6].
*   **Control Visual y KPI:** Monitoreo activo de la cantidad de órdenes en cola empleando semáforos visuales por colores y métricas de tiempo[cite: 6]. Calcula y muestra la duración exacta de la preparación de cada plato registrando las marcas temporales en `order_item_tracking` (`started_at` y `completed_at`) desde que el operador cambia el estado a 'En Preparación' hasta marcarlo como 'Completado'[cite: 2, 6]. Cualquier usuario de cocina está facultado para liberar el paso actual de la comanda[cite: 6].

### Módulo Transaccional, Pedidos y Pasarela de Pagos
*   **Persistencia del Carrito (React):** Prohibido usar tablas físicas para estados transitorios. Se almacena de forma íntegra en el cliente mediante **`localStorage`** referenciado al ID de usuario[cite: 2]. Muta a persistencia relacional al confirmar y guardar la cabecera en `orders` con estado `'Pendiente de pago'`[cite: 2, 6].
    *   La llave lógica del carrito es `tipo-id` (`product-8`, `combo-8`, `custom-*`) para evitar colisiones entre productos y combos que compartan el mismo ID numérico.
*   **Autogestión de Pedidos:** Registra tanto el ID del cliente que solicita como el del empleado que procesa de manera asistida (si aplica)[cite: 2, 6].
*   **Flujo Automático de Estados de Orden:** El estado progresa de manera controlada bajo la secuencia: `Pendiente de pago` $\rightarrow$ `Aceptada` $\rightarrow$ `Preparación` $\rightarrow$ `Procesando` $\rightarrow$ `Entregada`[cite: 2, 6].
*   **Pasarela Simulación:** 
    *   Si es `Entrega a domicilio`, se capturan campos de dirección física y se adiciona el costo de envío (`shipping_cost`) al cálculo[cite: 2, 6].
    *   Si es `Recogida en tienda`, el costo de envío se inicializa en `0.00`[cite: 2, 6].
    *   Para transacciones con Tarjeta (Crédito/Débito), se simula la captura de campos básicos y se enmascaran los últimos cuatro dígitos[cite: 2, 6].
    *   Para transacciones en Efectivo, se digita el monto recibido (`amount_tendered`) y el sistema procesa automáticamente el vuelto[cite: 2, 6].
*   **Notificaciones:** Al consolidarse el pago, se despacha un correo automatizado de confirmación con el desglose financiero e impositivo del 13% de IVA[cite: 2, 6].
*   **Historial y Seguimiento:** Los clientes monitorean en tiempo real la transición de estados de sus comandas activas y listan su histórico personal cronológicamente[cite: 6]. Los administradores y encargados visualizan el historial global con filtros avanzados por rangos de fechas y estados de pedido[cite: 6].

---

## 4. Automatizaciones Nativas de Servidor (Scripts SQL)
La API de PHP no debe recalcular de forma redundante las reglas financieras u operativas que ya implementan los siguientes objetos de base de datos en tu script[cite: 2]:

1.  **`tg_before_insert_payments`**: `BEFORE INSERT` sobre `payments`. Ejecuta la validación del efectivo, arroja una excepción `SIGNAL SQLSTATE '45000'` si el monto entregado es insuficiente y calcula automáticamente el vuelto matemático en `change_given`[cite: 2]. Setea a cero si es tarjeta[cite: 2].
2.  **`tg_after_update_order_status`**: `AFTER UPDATE` sobre `orders`. Al detectar el cambio de estado exacto a `'Aceptada'`, realiza el desglose automático de las líneas del detalle de la orden[cite: 2]. Si detecta un combo, lo expande en sus productos individuales constituyentes, busca la secuencia lógica de pasos de cocina de cada producto e inyecta de forma masiva las tareas operativas en la tabla `order_item_tracking` con estado `'Cola'`[cite: 2].
3.  **`sp_calculate_order_totals`**: Procedimiento almacenado que recibe `(p_order_id, p_shipping_cost)`. Suma el costo de las líneas de detalle (`quantity * unit_price`), aplica la tasa impositiva fija del 13% de IVA en Costa Rica (`tax`) y actualiza la cabecera transaccional en `orders` de manera asíncrona[cite: 2].

## 5. Respaldo de Aplicación para Cocina y Combos
Además de los triggers, `process_order.php` ejecuta `ensureOrderItemTracking(order_id)` después de actualizar la orden a `'Aceptada'`.

Este respaldo:
*   Inserta tareas faltantes para productos individuales.
*   Expande combos desde `combo_products` hacia `product_preparation_steps`.
*   Usa `LEFT JOIN order_item_tracking` para evitar duplicados.
*   Valida antes del pago que el combo exista, tenga productos internos y que todos sus productos tengan ruta de preparación.

Esta capa evita que un dump de BD desactualizado o un trigger ausente deje órdenes sin aparecer en el monitor de cocina.

# Ampliación de Reglas de Negocio: Categorías, Logística de Envíos y Tracking de Cocina
**Documentación Técnica a cargo de: Yorbain Cruz Jimenez**

## 1. Flexibilidad del Menú (Categorías)
El catálogo no está limitado a un nicho. La tabla `categories` debe ser utilizada para clasificar la oferta gastronómica de forma amplia (ej. "Mariscos", "Sopas", "Parrilla", "Postres"). 
*   **Instrucción para la IA:** Al diseñar los endpoints de productos, asegúrate de que el frontend permita filtrar dinámicamente por estos nombres de categoría para facilitar la navegación del cliente.

## 2. Flujo de Delivery (Contacto Directo y Envíos)
El sistema gestiona logística de entrega sin ser un e-commerce complejo, priorizando el contacto directo. 
*   **Instrucción para la IA:** Si el `delivery_method` en la tabla `orders` es `'Entrega a domicilio'`, la API debe requerir obligatoriamente el llenado del campo `delivery_address` e incluir el `shipping_cost` en el procedimiento almacenado de totales. 

## 3. Monitor de Cocina en Tiempo Real (Sistema de Estaciones)
El rastreo de la preparación opera por secciones independientes, similar al modelo de monitores de comida rápida (KDS - Kitchen Display System).
*   **Instrucción para la IA:** El frontend de cocina no debe ver "órdenes completas" monolíticas, sino **ítems individuales**. La interfaz debe consultar la tabla `order_item_tracking` filtrando por `station_id`. 
*   **Flujo de Estados:** El platillo aparece en `'Cola'` (insertado automáticamente por el trigger de MySQL al aceptar la orden). El cocinero en su estación cambia el estado a `'En Preparación'` y finalmente a `'Completado'`. La UI debe reflejar esto visualmente para mantener una línea de ensamblaje eficiente.
