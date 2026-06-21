┌─────────────────────────────────────────────────────────────────┐
│ 1. CLIENTE crea orden en CartPage                              │
│    • Añade productos/combos                                     │
│    • localStorage persiste el carrito                           │
│    • CartContext diferencia por tipo+id: product-8 ≠ combo-8    │
│    • Estado: orden en memoria                                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. Ir a Checkout (CartPage)                                     │
│    • Seleccionar método de pago (Tarjeta/Efectivo)             │
│    • Si Entrega: capturar dirección + calcular envío           │
│    • Si Mostrador: envío = $0                                  │
│    • Mostrar total con IVA 13%                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. Procesar Orden [process_order.php POST]                      │
│    ✓ Insertar en orders (status: "Pendiente de pago")          │
│    ✓ Insertar en order_details (líneas de orden)               │
│    ✓ Si la línea es combo: validar existencia en combos         │
│    ✓ Validar que el combo tenga productos internos              │
│    ✓ Validar rutas de preparación para sus productos            │
│    ✓ Insertar en payments (método pago)                        │
│    ✓ Llamar sp_calculate_order_totals(order_id, shipping)      │
│    ✓ UPDATE orders SET status = 'Aceptada'                     │
│    Estado: "Pendiente de pago" → "Aceptada"                    │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. TRIGGER + respaldo PHP                                       │
│    AL cambiar a 'Aceptada':                                     │
│    ✓ Desglosa cada producto → sus estaciones en product_prep   │
│    ✓ Si hay combo: expande en productos constituyentes         │
│    ✓ Crea filas en order_item_tracking (status: 'Cola')        │
│    ✓ ensureOrderItemTracking() crea faltantes sin duplicar      │
│    Estado: "Aceptada" (pero items en Cola en cocina)            │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. COCINA ve items en KitchenPage                               │
│    • Filtra por estación o vista "Todas"                        │
│    • Ve SOLO ítems con status != 'Completado'                 │
│    • En combos muestra el producto interno y el combo padre     │
│    • Botón "Empezar": Cola → En Preparación [started_at]       │
│    • Botón "Terminar": En Preparación → Completado [completed] │
│    Estado: items circulan por "Cola" → "En Preparación" → ...  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. TRIGGER: tg_after_update_item_tracking                       │
│    Cada vez que se actualiza un item_tracking:                 │
│    • Si "En Preparación": UPDATE orders status = 'Preparación' │
│    • Si "Completado": verifica si todos están 'Completado'    │
│      - Si SÍ: UPDATE orders status = 'Procesando'              │
│    Estado: orden pasa a "Procesando" cuando 100% completo      │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 7. DESPACHO ve orden en DispatchPage                            │
│    [get_ready_orders.php → WHERE status = 'Procesando']        │
│    • Muestra cliente, total, método entrega, dirección         │
│    • Botón: "Enviar con repartidor" / "Entregar a cliente"    │
│    Estado: orden lista para entrega                             │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 8. Marcar como Entregada [update_order_status.php]              │
│    UPDATE orders SET status = 'Entregada'                       │
│    Estado: "Procesando" → "Entregada"                           │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 9. CLIENTE ve en TrackingPage: "Entregada" ✓                   │
│    localStorage se limpia tras confirmación                     │
│    Ciclo completo finalizado                                    │
└─────────────────────────────────────────────────────────────────┘

Notas operativas:
- Un combo sin registros en `combo_products` no puede pasar a cocina.
- Cada producto dentro del combo debe tener pasos en `product_preparation_steps`.
- Si se editan combos o se corrige su composición, conviene vaciar `aqua_cart` en el navegador antes de repetir pruebas.
