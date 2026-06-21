# 🍽️ Aqua Manjar - Sistema de Gestión de Pedidos y Cocina

**Descripción:** Plataforma integral para gestión de pedidos, preparación en cocina y despacho de comida multicultural desarrollada con **React 19 + PHP 8.2 + MySQL 8.0**.

**Proyecto Académico:** Grupo #14  
**Desarrollador:** Yanfret Cruz Jiménez  
**Institución:** Diplomado en Desarrollo Web Full Stack  
**Fecha:** Junio 2026

---

## 🚀 Inicio Rápido (3 pasos)

### 1. **Instalación de Base de Datos**
```bash
# En phpMyAdmin o terminal MySQL:
mysql -u root -p < database/init.sql
```
Crea `aqua_manjar_db` con:
- 16 tablas (usuarios, órdenes, cocina, pagos)
- 3 triggers automáticos
- 1 procedimiento almacenado

### 2. **Ejecutar Backend (PHP)**
```bash
# Requiere XAMPP ejecutándose:
# - Apache en puerto 81 ✓
# - MySQL corriendo ✓

Accesible automáticamente en:
http://localhost:81/AquaManjarProyecto/backend/public/
```

### 3. **Ejecutar Frontend (React)**
```bash
cd frontend
npm install
npm run dev
```
Abre en navegador: `http://localhost:5173`

---

## 📊 Arquitectura del Proyecto

```
AquaManjarProyecto/
├── database/
│   ├── init.sql              # 🔑 Base de datos completa + triggers
│   └── aqua_manjar_db.sql    # Backup
│
├── backend/
│   ├── config/
│   │   └── Database.php      # Conexión PDO
│   ├── controllers/
│   │   ├── UserController.php
│   │   └── ProductController.php
│   ├── models/
│   │   ├── User.php
│   │   └── Product.php
│   └── public/               # 🔑 API REST endpoints
│       ├── login.php
│       ├── process_order.php
│       ├── get_kitchen_items.php
│       ├── update_item_status.php
│       ├── get_ready_orders.php
│       ├── update_order_status.php
│       ├── manage_products.php
│       ├── manage_combos.php
│       ├── get_product_detail.php
│       ├── get_combo_detail.php
│       ├── get_menus_public.php
│       ├── get_preparation_processes.php
│       ├── manage_preparation_steps.php
│       └── [+ endpoints de usuarios, pagos y catálogo]
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Rutas principales
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── ComboDetailPage.jsx
│   │   │   ├── MenusPage.jsx
│   │   │   ├── PreparationProcessesPage.jsx
│   │   │   ├── KitchenPage.jsx       # 🔑 Monitor de cocina KDS
│   │   │   ├── DispatchPage.jsx      # 🔑 Despacho de órdenes
│   │   │   ├── TrackingPage.jsx
│   │   │   ├── AdminProductsPage.jsx
│   │   │   ├── AdminCombosPage.jsx
│   │   │   ├── AdminPreparationStepsPage.jsx
│   │   │   ├── AdminMenusPage.jsx
│   │   │   ├── AdminOrdersHistoryPage.jsx
│   │   │   ├── AdminUsersPage.jsx
│   │   │   └── [+más páginas]
│   │   ├── components/
│   │   │   ├── Navbar.jsx    # Menú principal con roles
│   │   │   └── Footer.jsx
│   │   ├── context/
│   │   │   └── CartContext.jsx   # Carrito por tipo+id para productos/combos
│   │   └── services/
│   │       └── api.js
│   └── public/
│       └── uploads/products/ # Imágenes de productos
│
├── README.md                 # Este archivo
├── DEFENSA_AQUA_MANJAR.md   # Presentación académica
└── GuiaDeEnfoque.md         # Bitácora técnica
```

---

## 👥 Sistema de Roles (RBAC)

| Rol | ID | Acceso | Funciones |
|-----|-------|--------|-----------|
| **Administrador** | 1 | Todas las páginas | CRUD de productos, menús, usuarios, estaciones, ingredientes, combos |
| **Encargado** | 2 | Historial, Admin | Monitoreo global de órdenes y despachos |
| **Cocina** | 3 | KitchenPage | Preparar platos por estación, marcar completado |
| **Cliente** | 4 | Catálogo, Perfil | Crear órdenes, pagar, rastrear estado |

---

## 🔄 Flujo Completo de Orden (CRITICAL PATH)

```
1. CLIENTE crea orden en CartPage
   • Añade productos/combos
   • localStorage persiste el carrito
   • El carrito distingue por tipo+id (product-8 ≠ combo-8)
   ↓
2. Ir a Checkout
   • Seleccionar método de pago (Tarjeta/Efectivo)
   • Si Entrega: capturar dirección + calcular envío
   • Si Mostrador: envío = $0
   • Mostrar total con IVA 13%
   ↓
3. Procesar Orden [process_order.php POST]
   ✓ Insertar en orders (status: "Pendiente de pago")
   ✓ Insertar en order_details (líneas)
   ✓ Validar combos: existencia, productos internos y rutas de preparación
   ✓ Insertar en payments (método pago)
   ✓ UPDATE orders SET status = 'Aceptada'
   ↓
4. TRIGGER + respaldo PHP: generación de cocina
   • Desglosa cada producto → sus estaciones
   • Si hay combo: expande en productos
   • Crea filas en order_item_tracking (status: 'Cola')
   • process_order.php ejecuta ensureOrderItemTracking() para reparar si el trigger no creó filas
   ↓
5. COCINA ve items en KitchenPage
   • Filtra por estación
   • Botón "Empezar": Cola → En Preparación
   • Botón "Terminar": En Preparación → Completado
   ↓
6. TRIGGER: tg_after_update_item_tracking
   • Si todas completadas: orden → "Procesando"
   ↓
7. DESPACHO ve orden en DispatchPage
   [get_ready_orders.php → WHERE status = 'Procesando']
   ↓
8. Marcar como Entregada [update_order_status.php]
   ↓
9. CLIENTE ve en TrackingPage: "Entregada" ✓
```

---

## 🍳 Monitor de Cocina (KitchenPage) - KDS

**Sistema de Kitchen Display System (KDS):**

- **Filtrado dinámico:** Seleccionar estación o ver "Todas"
- **Visualización de ítems:** NO órdenes completas, sino **ítems individuales por paso**
- **Estados visuales:**
  - 🔴 **Cola** - Rojo: Esperando inicio
  - 🟡 **En Preparación** - Amarillo: Cocinero trabaja
  - 🟢 **Completado** - Verde: Listo, pasa a siguiente estación

- **Información mostrada:**
  - Número de orden
  - Nombre del plato + cantidad
  - Producto interno del combo y combo padre ("Parte de")
  - Notas especiales del cliente
  - Método de entrega
  - Hora de inicio/término

- **Interacción:**
  - Botón "Empezar" (solo en Cola)
  - Botón "Terminar" (solo en En Preparación)
  - Auto-refresco cada 10 segundos

---

## 📦 Estación de Despacho (DispatchPage)

**Interfaz operativa para entregas finales:**

- **Filtro automático:** Solo muestra órdenes en estado `'Procesando'`
- **Diferenciación de métodos:**
  - **Entrega a domicilio:** Muestra dirección, botón "Enviar con repartidor"
  - **Recogida en tienda:** Botón "Entregar a cliente"

- **Información por orden:**
  - ID de pedido
  - Nombre del cliente
  - Total con impuestos
  - Dirección (si aplica)
  - Método de pago

---

## 🔐 Automatizaciones en Base de Datos

### Trigger: `tg_before_insert_payments`
**Validación de efectivo y cálculo de vuelto:**
- Si Efectivo: verifica amount_tendered >= total
- Si suficiente: calcula change_given = amount_tendered - total
- Si insuficiente: SIGNAL error (rechaza insert)
- Si Tarjeta: setea amount_tendered = NULL, change_given = 0

### Trigger: `tg_after_update_order_status`
**Desglose automático al aceptar orden:**
- Si NEW.status = 'Aceptada'
- Busca cada product_id en order_details
- Para cada producto: JOIN product_preparation_steps
- INSERT en order_item_tracking (status: 'Cola')
- Si combo: expande en productos constituyentes

### Respaldo PHP: `ensureOrderItemTracking(order_id)`
**Generación idempotente de tareas de cocina:**
- Se ejecuta desde `process_order.php` después de cambiar la orden a `'Aceptada'`
- Inserta tareas faltantes en `order_item_tracking` para productos individuales
- Expande combos desde `combo_products` hacia `product_preparation_steps`
- Evita duplicados con `LEFT JOIN order_item_tracking`

### Trigger: `tg_after_update_item_tracking`
**Promoción automática de estados:**
- Si NEW.status = 'En Preparación': UPDATE orden a 'Preparación'
- Si NEW.status = 'Completado':
  - COUNT items con status != 'Completado'
  - Si COUNT = 0: UPDATE orden a 'Procesando'

### Procedimiento: `sp_calculate_order_totals(order_id, shipping_cost)`
**Cálculo de montos con impuestos:**
- SUM(quantity * unit_price) = subtotal
- tax = subtotal * 0.13 (IVA 13%)
- total = subtotal + tax + shipping_cost
- UPDATE orders con valores calculados

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| **Frontend** | React | 19.1.1 |
| **Enrutamiento** | React Router | 7.17.0 |
| **Build** | Vite | 6.0.0 |
| **Mapas** | Leaflet + react-leaflet | 1.9.4 |
| **Backend** | PHP | 8.2.12 |
| **Base de Datos** | MySQL | 8.0+ |
| **Motor DB** | InnoDB | - |
| **Servidor** | XAMPP | 81, 3306 |

---

## 📋 Endpoints Principales

### 🔑 Autenticación
- `POST /login.php` - Login de usuario
- `POST /request_password_reset.php` - Genera token temporal
- `POST /reset_password.php` - Cambia contraseña con token
- `POST /update_profile.php` - Actualiza datos del usuario

### 🛍️ Productos & Catálogo
- `GET /get_products.php?admin=true` - Listar todos (admin) o filtrados
- `GET /get_categories.php` - Listar categorías con tipo (`PRODUCTO`, `COMBO`, `GENERAL`)
- `GET /get_ingredients.php` - Listar ingredientes
- `GET /get_product_detail.php?id={id}` - Detalle público de producto con ingredientes
- `GET /get_combo_detail.php?id={id}` - Detalle público de combo con productos internos
- `POST /manage_products.php` - CRUD de productos
- `POST /manage_combos.php?action=create|update` - CRUD de combos con imagen y productos asociados
- `POST /manage_ingredients.php` - CRUD de ingredientes

### 📋 Avance 3: Listados y Detalles
- `GET /get_menus_public.php?action=list` - Listado público de menús ordenado por disponibilidad
- `GET /get_menus_public.php?action=available` - Menú disponible agrupable por categoría
- `GET /get_preparation_processes.php` - Listado de procesos con cantidad de pasos
- `GET /get_preparation_processes.php?product_id={id}` - Detalle de estaciones por producto

### 🎫 Órdenes & Pagos
- `POST /process_order.php` - Crear nueva orden + items + pago
- `GET /get_user_orders.php` - Historial personal del cliente
- `POST /update_order_status.php` - Cambiar estado de orden
- `GET /get_admin_orders.php` - Historial global (admin + encargado)

### 👨‍🍳 Cocina & Estaciones
- `GET /get_kitchen_items.php` - Items en cocina (filtra por estación)
- `GET /get_preparation_steps.php` - Pasos de un producto
- `POST /manage_preparation_steps.php` - Asignar estaciones a producto
- `POST /update_item_status.php` - Cambiar estado de item

### 📦 Despacho
- `GET /get_ready_orders.php` - Órdenes listas (status = 'Procesando')
- `POST /update_order_status.php` - Marcar como "Entregada"

### 📋 Menús (Admin)
- `GET /manage_menus.php?action=list` - Listar menús programados
- `GET /manage_menus.php?action=items&menu_id={id}` - Listar productos y combos de un menú
- `POST /manage_menus.php?action=create|update` - Crear o actualizar menús
- `POST /manage_menus.php?action=add_item` - Agregar producto o combo a un menú
- `DELETE /manage_menus.php?action=delete|remove_item` - Eliminar menú o quitar ítem

### 👥 Usuarios (Admin)
- `GET /get_users.php` - Listar usuarios
- `POST /admin_create_user.php` - Crear usuario
- `POST /admin_delete_user.php` - Eliminar usuario

---

## ✅ Checklist de Funcionalidades Implementadas

**Gestión Administrativa:**
- [x] CRUD de Productos
- [x] CRUD de Combos con imagen, productos internos y cantidades
- [x] Gestión de Ingredientes
- [x] Rutas de Preparación por Estación
- [x] Gestión de Menús con horarios
- [x] Gestión de Usuarios

**Operativa de Cocina:**
- [x] Monitor de Cocina (KDS) en tiempo real
- [x] Control de items por estación
- [x] Estados visuales (Cola → En Prep → Completado)
- [x] Cálculo de tiempos (started_at, completed_at)
- [x] Filtrado dinámico por estación

**Flujo de Pedidos:**
- [x] Carrito persistente en localStorage
- [x] Carrito diferencia productos y combos aunque compartan el mismo ID numérico
- [x] Checkout con métodos de pago
- [x] Cálculo automático de impuestos (IVA 13%)
- [x] Entregas a domicilio + costo de envío
- [x] Recogida en tienda
- [x] Vuelto automático en efectivo
- [x] Validación de combos antes de pagar
- [x] Generación de tareas de cocina para combos

**Avance 3 - Listados y Detalles:**
- [x] Listado público de productos en cards
- [x] Detalle público de producto con ingredientes
- [x] Detalle público de combo con productos internos
- [x] Vista pública de menús y menú disponible
- [x] Listado y detalle de procesos de preparación

**Seguimiento & Despacho:**
- [x] Estación de Despacho
- [x] Seguimiento en tiempo real
- [x] Historial de órdenes por cliente
- [x] Historial global (admin)

**Seguridad & UX:**
- [x] RBAC con 4 roles
- [x] Autenticación con hash seguro
- [x] Recuperación de contraseña con token
- [x] Manejo de errores en fetch
- [x] Null checks en renderizado
- [x] Footer sticky
- [x] Diseño responsive

---

## 🔍 Credenciales de Prueba

```
ADMINISTRADOR:
  Email:     admin@aquamanjar.com
  Role ID:   1

COCINA:
  Email:     chef@gmail.com
  Role ID:   3

ENCARGADO:
  Email:     encargado@gmail.com
  Role ID:   2

CLIENTE (AUTORREGISTRO):
  ⚠️ NO hay credenciales precargadas
  
  Flujo:
  1. Abre LoginPage (http://localhost:5173/login)
  2. Click botón "¿No tienes cuenta? Regístrate"
  3. Completa formulario:
     - Nombre: Tu nombre
     - Email: email@ejemplo.com (ÚNICO)
     - Contraseña: mínimo 6 caracteres
     - Teléfono: (opcional)
  4. Click "Crear Cuenta"
  5. Cuenta creada automáticamente con role_id = 4 (Cliente)
  6. Inicia sesión automáticamente
  7. Acceso a: Catálogo, Carrito, Checkout, Seguimiento
  
  ✅ NO requiere validación de admin
  ✅ Email UNIQUE en BD (no duplicados)
  ✅ Contraseña hasheada con bcrypt
```

---

## 📌 Notas Críticas

1. **Rutas de Preparación OBLIGATORIAS:**
   Si un producto NO tiene pasos en `product_preparation_steps`, **no aparecerá en cocina**.

2. **Combos OBLIGATORIAMENTE completos:**
   Un combo debe tener productos en `combo_products`, y cada producto interno debe tener ruta de preparación. Si falta esto, el backend bloquea el pago con un mensaje claro.

3. **Carrito en localStorage:**
   Se persiste en `aqua_cart`. Si cambian IDs, tipos de ítem o estructura de combos, conviene vaciar el carrito antes de probar de nuevo.

4. **Triggers de BD críticos + respaldo PHP:**
   Los triggers generan tareas y promueven estados. `process_order.php` también ejecuta `ensureOrderItemTracking()` para crear tareas faltantes de cocina sin duplicar.

5. **Puerto de Apache:**
   Si XAMPP está en puerto distinto, actualizar `API_BASE_URL` en React.

6. **Permisos de carpeta:**
   `/frontend/public/uploads/products/` debe tener permisos de escritura para productos y combos.

7. **Menú Activo:**
   Solo 1 menú puede tener `is_active = TRUE`.
   
8. **Autorregistro de Clientes:**
   Completamente abierto (público). Cualquiera puede crear cuenta sin validación.
   Email debe ser único, contraseña se hashea automáticamente.
   role_id se asigna automáticamente = 4 (Cliente).

---

**Desarrollador:** Yanfret Cruz Jiménez  
**Proyecto:** Aqua Manjar - Fusión Gastronómica Multicultural  
**Grupo:** #14  
**Fecha de Finalización:** Junio 2026  
**Estado:** ✅ Producción Académica

