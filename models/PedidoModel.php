<?php
class PedidoModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    private function limpiar($valor)
    {
        return addslashes(trim((string) $valor));
    }


    public function getClientes()
    {
        try {
            $vSql = "SELECT IdCliente, Nombre, Correo, Telefono, Direccion FROM clientes ORDER BY Nombre;";
            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    private function obtenerClientePorUsuario($idUsuario)
    {
        $idUsuario = (int) $idUsuario;
        $vSql = "SELECT IdCliente, Nombre, Correo, Telefono, Direccion FROM clientes WHERE IdUsuario=$idUsuario;";
        $resultado = $this->enlace->ExecuteSQL($vSql);
        return $resultado ? $resultado[0] : null;
    }

    public function getClientePropio($idUsuario)
    {
        try {
            return $this->obtenerClientePorUsuario($idUsuario);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    private function obtenerEncargadoPedido($idUsuario)
    {
        $idUsuario = (int) $idUsuario;
        $vSqlUsuario = "SELECT u.IdUsuario, r.Nombre AS Rol
                        FROM usuarios u
                        INNER JOIN rol r ON u.IdRol = r.IdRol
                        WHERE u.IdUsuario=$idUsuario AND u.Estado=1;";
        $usuario = $this->enlace->ExecuteSQL($vSqlUsuario);

        if ($usuario && $usuario[0]->Rol === 'Encargado') {
            return (int) $usuario[0]->IdUsuario;
        }

        if (!$usuario || $usuario[0]->Rol !== 'Administrador') {
            throw new Exception('Solo el personal puede registrar pedidos');
        }

        $vSqlEncargado = "SELECT u.IdUsuario
                          FROM usuarios u
                          INNER JOIN rol r ON u.IdRol = r.IdRol
                          WHERE r.Nombre='Encargado' AND u.Estado=1
                          ORDER BY u.IdUsuario ASC
                          LIMIT 1;";
        $encargado = $this->enlace->ExecuteSQL($vSqlEncargado);

        if (!$encargado) {
            throw new Exception('No hay un encargado activo para asignar el pedido');
        }

        return (int) $encargado[0]->IdUsuario;
    }

    private function obtenerOCrearCliente($idUsuario, $nombre, $telefono, $correo, $direccion)
    {
        $idUsuario = (int) $idUsuario;
        $existente = $this->obtenerClientePorUsuario($idUsuario);

        $telefonoLimpio = $this->limpiar($telefono);
        $direccionLimpia = $this->limpiar($direccion);

        if ($existente) {
            $idCliente = (int) $existente->IdCliente;
            $this->enlace->executeSQL_DML(
                "UPDATE clientes SET Telefono='$telefonoLimpio', Direccion='$direccionLimpia' WHERE IdCliente=$idCliente;"
            );
            return $idCliente;
        }

        $nombreLimpio = $this->limpiar($nombre);
        $correoLimpio = $this->limpiar($correo);

        $vSql = "INSERT INTO clientes (Nombre, Telefono, Correo, Direccion, FechaRegistro, IdUsuario)
                 VALUES ('$nombreLimpio', '$telefonoLimpio', '$correoLimpio', '$direccionLimpia', CURDATE(), $idUsuario);";
        return $this->enlace->executeSQL_DML_last($vSql);
    }


    private function crearCarrito($idCliente, $items)
    {
        $idCliente = (int) $idCliente;
        $idCarrito = $this->enlace->executeSQL_DML_last(
            "INSERT INTO carritos (IdCliente, FechaCreacion, Estado) VALUES ($idCliente, CURDATE(), 1);"
        );

        foreach ($items as $item) {
            $cantidad = (int) ($item->Cantidad ?? 1);
            $observaciones = $this->limpiar($item->Observaciones ?? '');
            if (!empty($item->IdProducto)) {
                $idProducto = (int) $item->IdProducto;
                $this->enlace->executeSQL_DML(
                    "INSERT INTO carritoproductos (IdCarrito, IdProducto, Cantidad, Observaciones)
                     VALUES ($idCarrito, $idProducto, $cantidad, '$observaciones');"
                );
            } elseif (!empty($item->IdCombo)) {
                $idCombo = (int) $item->IdCombo;
                $this->enlace->executeSQL_DML(
                    "INSERT INTO carritocombos (IdCarrito, IdCombo, Cantidad, Observaciones)
                     VALUES ($idCarrito, $idCombo, $cantidad, '$observaciones');"
                );
            }
        }

        return $idCarrito;
    }

    public function enviarCarrito($objeto)
    {
        try {
            $idUsuario = (int) ($objeto->IdUsuario ?? 0);
            $cliente = $this->obtenerClientePorUsuario($idUsuario);

            if (!$cliente) {
                throw new Exception('No se encontro el cliente de la sesion');
            }
            if (empty($objeto->items) || !is_array($objeto->items)) {
                throw new Exception('El carrito esta vacio');
            }

            $metodoEntrega = $this->limpiar($objeto->MetodoEntrega ?? 'Recogida en tienda');
            $direccionEntrega = $this->limpiar($objeto->DireccionEntrega ?? '');
            $metodoPago = $this->limpiar($objeto->MetodoPago ?? 'Efectivo');
            if (!in_array($metodoEntrega, ['Recogida en tienda', 'Entrega a domicilio'])) {
                throw new Exception('Metodo de entrega invalido');
            }
            if ($metodoEntrega === 'Entrega a domicilio' && $direccionEntrega === '') {
                throw new Exception('Debe indicar la direccion de entrega');
            }
            if (!in_array($metodoPago, ['Efectivo', 'Tarjeta'])) {
                throw new Exception('Metodo de pago invalido');
            }
            $costoEnvio = $metodoEntrega === 'Entrega a domicilio' ? 1500 : 0;

            $idCarrito = $this->crearCarrito((int) $cliente->IdCliente, $objeto->items);
            $this->enlace->executeSQL_DML(
                "UPDATE carritos SET EstadoSolicitud='Enviado', FechaEnvio=NOW(),
                    MetodoEntrega='$metodoEntrega', DireccionEntrega='$direccionEntrega',
                    CostoEnvio=$costoEnvio, MetodoPago='$metodoPago'
                 WHERE IdCarrito=$idCarrito;"
            );

            return ['IdCarrito' => $idCarrito, 'Enviado' => true];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getCarritosPendientes($idUsuario)
    {
        try {
            $idEncargado = $this->obtenerEncargadoPedido($idUsuario);
            $vSql = "SELECT ca.IdCarrito, ca.FechaEnvio, ca.EstadoSolicitud,
                            cl.IdCliente, cl.Nombre AS ClienteNombre,
                            (SELECT GROUP_CONCAT(CONCAT(p.Nombre, ' x', cp.Cantidad) SEPARATOR '|')
                             FROM carritoproductos cp
                             INNER JOIN productos p ON cp.IdProducto=p.IdProducto
                             WHERE cp.IdCarrito=ca.IdCarrito) AS Productos,
                            (SELECT GROUP_CONCAT(CONCAT(co.Nombre, ' x', cc.Cantidad) SEPARATOR '|')
                             FROM carritocombos cc
                             INNER JOIN combos co ON cc.IdCombo=co.IdCombo
                             WHERE cc.IdCarrito=ca.IdCarrito) AS Combos
                     FROM carritos ca
                     INNER JOIN clientes cl ON ca.IdCliente = cl.IdCliente
                     WHERE ca.EstadoSolicitud='Enviado'
                        OR (ca.EstadoSolicitud='En revision' AND ca.IdEncargado=$idEncargado)
                     ORDER BY ca.FechaEnvio ASC;";
            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    private function getCarritoSolicitud($idCarrito)
    {
        $idCarrito = (int) $idCarrito;
        $encabezado = $this->enlace->ExecuteSQL(
            "SELECT ca.IdCarrito, ca.IdCliente, ca.EstadoSolicitud, ca.MetodoEntrega,
                    ca.DireccionEntrega, ca.CostoEnvio, ca.MetodoPago,
                    cl.Nombre AS ClienteNombre
             FROM carritos ca
             INNER JOIN clientes cl ON ca.IdCliente=cl.IdCliente
             WHERE ca.IdCarrito=$idCarrito;"
        );
        if (!$encabezado) {
            throw new Exception('El carrito no existe');
        }

        $items = $this->enlace->ExecuteSQL(
            "SELECT p.IdProducto AS Id, NULL AS IdCombo, 'producto' AS Tipo,
                    p.Nombre, p.Precio, cp.Cantidad, cp.Observaciones
             FROM carritoproductos cp
             INNER JOIN productos p ON cp.IdProducto=p.IdProducto
             WHERE cp.IdCarrito=$idCarrito
             UNION ALL
             SELECT NULL AS Id, c.IdCombo, 'combo' AS Tipo,
                    c.Nombre, c.Precio, cc.Cantidad, cc.Observaciones
             FROM carritocombos cc
             INNER JOIN combos c ON cc.IdCombo=c.IdCombo
             WHERE cc.IdCarrito=$idCarrito;"
        );

        $resultado = $encabezado[0];
        $resultado->Items = $items ?: [];
        return $resultado;
    }

    public function atenderCarrito($objeto)
    {
        try {
            $idCarrito = (int) ($objeto->IdCarrito ?? 0);
            $idUsuario = (int) ($objeto->IdUsuario ?? 0);
            $idEncargado = $this->obtenerEncargadoPedido($idUsuario);

            $actualizados = $this->enlace->executeSQL_DML(
                "UPDATE carritos SET EstadoSolicitud='En revision', IdEncargado=$idEncargado, FechaAtencion=NOW()
                 WHERE IdCarrito=$idCarrito
                   AND (EstadoSolicitud='Enviado'
                        OR (EstadoSolicitud='En revision' AND IdEncargado=$idEncargado));"
            );
            if ($actualizados === 0) {
                throw new Exception('El carrito ya fue tomado por otro encargado');
            }

            return $this->getCarritoSolicitud($idCarrito);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    private function obtenerPasosDeLinea($idProducto, $idCombo)
    {
        if (!empty($idProducto)) {
            $idProducto = (int) $idProducto;
            $vSql = "SELECT IdEstacion, Orden FROM productopreparacion
                     WHERE IdProducto=$idProducto AND Estado=1
                     ORDER BY Orden ASC;";
            $resultado = $this->enlace->ExecuteSQL($vSql);
            return array_map(fn($fila) => ['IdEstacion' => (int) $fila->IdEstacion, 'Orden' => (int) $fila->Orden], $resultado ?: []);
        }

        if (!empty($idCombo)) {
            $idCombo = (int) $idCombo;
            $vSql = "SELECT pp.IdEstacion, pp.Orden
                     FROM comboproductos cp
                     INNER JOIN productopreparacion pp ON cp.IdProducto = pp.IdProducto AND pp.Estado = 1
                     WHERE cp.IdCombo=$idCombo
                     GROUP BY pp.IdEstacion, pp.Orden
                     ORDER BY pp.Orden ASC;";
            $resultado = $this->enlace->ExecuteSQL($vSql);

            return array_map(fn($fila) => [
                'IdEstacion' => (int) $fila->IdEstacion,
                'Orden' => (int) $fila->Orden
            ], $resultado ?: []);
        }

        return [];
    }

    public function create($objeto)
    {
        try {
            $idUsuario = (int) ($objeto->IdUsuario ?? 0);
            if ($idUsuario <= 0) {
                throw new Exception('Debe iniciar sesion para completar el pedido');
            }

            $idEncargado = $this->obtenerEncargadoPedido($idUsuario);

            if (empty($objeto->items) || !is_array($objeto->items)) {
                throw new Exception('El pedido no tiene productos ni combos');
            }

            $esEncargado = !empty($objeto->EsEncargado);

            if ($esEncargado) {
                $idClienteSeleccionado = (int) ($objeto->IdClienteSeleccionado ?? 0);
                if ($idClienteSeleccionado <= 0) {
                    throw new Exception('Debe seleccionar un cliente para el pedido');
                }
                $idCliente = $idClienteSeleccionado;
            } else {
                $idCliente = $this->obtenerOCrearCliente(
                    $idUsuario,
                    $objeto->Nombre ?? '',
                    $objeto->Telefono ?? '',
                    $objeto->Correo ?? '',
                    $objeto->Direccion ?? ''
                );
            }

            $metodoEntrega = $this->limpiar($objeto->MetodoEntrega ?? 'Recogida en tienda');
            $direccionEntrega = $this->limpiar($objeto->DireccionEntrega ?? '');
            $costoEnvio = ($metodoEntrega === 'Entrega a domicilio') ? (float) ($objeto->CostoEnvio ?? 1500) : 0;

            $totalSinImpuesto = 0;
            $lineasCalculadas = [];

            $tasaImpuesto = 0.13;

            foreach ($objeto->items as $item) {
                $precioUnitario = (float) ($item->PrecioUnitario ?? 0);
                $cantidad = (int) ($item->Cantidad ?? 1);
                $subtotal = $precioUnitario * $cantidad;
                $impuesto = round(($subtotal * $tasaImpuesto) / 5) * 5;

                $totalSinImpuesto += $subtotal;

                $lineasCalculadas[] = [
                    'IdProducto' => !empty($item->IdProducto) ? (int) $item->IdProducto : null,
                    'IdCombo' => !empty($item->IdCombo) ? (int) $item->IdCombo : null,
                    'Cantidad' => $cantidad,
                    'PrecioUnitario' => $precioUnitario,
                    'Subtotal' => $subtotal,
                    'Impuesto' => $impuesto,
                    'Observaciones' => $this->limpiar($item->Observaciones ?? ''),
                ];
            }

            $totalImpuestos = array_sum(array_column($lineasCalculadas, 'Impuesto'));
            $totalConImpuesto = $totalSinImpuesto + $totalImpuestos + $costoEnvio;

            $idCarritoSolicitud = (int) ($objeto->IdCarritoSolicitud ?? 0);
            if ($idCarritoSolicitud > 0) {
                $carritoSolicitud = $this->enlace->ExecuteSQL(
                    "SELECT IdCarrito FROM carritos
                     WHERE IdCarrito=$idCarritoSolicitud AND IdCliente=$idCliente
                       AND IdEncargado=$idEncargado AND EstadoSolicitud='En revision';"
                );
                if (!$carritoSolicitud) {
                    throw new Exception('El carrito enviado no esta disponible');
                }
                $idCarrito = $idCarritoSolicitud;
            } else {
                $idCarrito = $this->crearCarrito($idCliente, $objeto->items);
            }

            $vSql = "INSERT INTO pedidos
                        (IdCliente, IdUsuario, IdCarrito, FechaPedido, Estado, Total,
                         MetodoEntrega, DireccionEntrega, CostoEnvio, TotalSinImpuesto)
                      VALUES
                        ($idCliente, $idEncargado, $idCarrito, CURDATE(), 'Pendiente de pago', $totalConImpuesto,
                         '$metodoEntrega', '$direccionEntrega', $costoEnvio, $totalSinImpuesto);";
            $idPedido = $this->enlace->executeSQL_DML_last($vSql);

           foreach ($lineasCalculadas as $linea) {
                $idProductoSql = $linea['IdProducto'] ?? 'NULL';
                $idComboSql = $linea['IdCombo'] ?? 'NULL';

                $idDetalle = $this->enlace->executeSQL_DML_last(
                    "INSERT INTO detallepedidos
                        (IdPedido, IdProducto, IdCombo, Cantidad, PrecioUnitario, Subtotal, Impuesto, Observaciones)
                     VALUES
                        ($idPedido, $idProductoSql, $idComboSql, {$linea['Cantidad']}, {$linea['PrecioUnitario']},
                         {$linea['Subtotal']}, {$linea['Impuesto']}, '{$linea['Observaciones']}');"
                );

                $pasos = $this->obtenerPasosDeLinea($linea['IdProducto'], $linea['IdCombo']);
                foreach ($pasos as $paso) {
                    $this->enlace->executeSQL_DML(
                        "INSERT INTO detallepedidoestacion (IdDetalle, IdEstacion, Estado, Orden)
                         VALUES ($idDetalle, {$paso['IdEstacion']}, 'Cola', {$paso['Orden']});"
                    );
                }
            }

            $metodoPago = $this->limpiar($objeto->MetodoPago ?? 'Efectivo');
            $montoRecibido = isset($objeto->MontoRecibido) ? (float) $objeto->MontoRecibido : null;
            $vuelto = ($metodoPago === 'Efectivo' && $montoRecibido !== null) ? max(0, $montoRecibido - $totalConImpuesto) : null;

            $montoRecibidoSql = $montoRecibido !== null ? $montoRecibido : 'NULL';
            $vueltoSql = $vuelto !== null ? $vuelto : 'NULL';

            $this->enlace->executeSQL_DML(
                "INSERT INTO pagos (IdPedido, MetodoPago, Monto, FechaPago, Estado, MontoRecibido, Vuelto)
                 VALUES ($idPedido, '$metodoPago', $totalConImpuesto, CURDATE(), 1, $montoRecibidoSql, $vueltoSql);"
            );

            $this->enlace->executeSQL_DML("UPDATE pedidos SET Estado='Aceptada' WHERE IdPedido=$idPedido;");
            $this->enlace->executeSQL_DML(
                "UPDATE carritos SET EstadoSolicitud='Procesado', IdEncargado=$idEncargado, FechaAtencion=NOW()
                 WHERE IdCarrito=$idCarrito;"
            );

            return $this->get($idPedido);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $idPedido = (int) $id;

            $vSqlPedido = "SELECT p.IdPedido, p.FechaPedido, p.Estado, p.Total, p.TotalSinImpuesto,
                                  p.MetodoEntrega, p.DireccionEntrega, p.CostoEnvio,
                                  c.Nombre AS ClienteNombre, c.Correo AS ClienteCorreo,
                                  u.Nombre AS EncargadoNombre, u.Apellido AS EncargadoApellido,
                                  pg.MetodoPago, pg.Monto AS MontoPagado, pg.MontoRecibido, pg.Vuelto
                           FROM pedidos p
                           INNER JOIN clientes c ON p.IdCliente = c.IdCliente
                           INNER JOIN usuarios u ON p.IdUsuario = u.IdUsuario
                           LEFT JOIN pagos pg ON pg.IdPedido = p.IdPedido
                           WHERE p.IdPedido = $idPedido;";
            $pedido = $this->enlace->ExecuteSQL($vSqlPedido);

            if (!$pedido) {
                return null;
            }

            $vSqlDetalle = "SELECT dp.IdDetalle, dp.Cantidad, dp.PrecioUnitario, dp.Subtotal, dp.Impuesto, dp.Observaciones,
                                   COALESCE(pr.Nombre, co.Nombre) AS Nombre,
                                   CASE WHEN dp.IdProducto IS NOT NULL THEN 'Producto' ELSE 'Combo' END AS Tipo
                            FROM detallepedidos dp
                            LEFT JOIN productos pr ON dp.IdProducto = pr.IdProducto
                            LEFT JOIN combos co ON dp.IdCombo = co.IdCombo
                            WHERE dp.IdPedido = $idPedido;";
            $detalle = $this->enlace->ExecuteSQL($vSqlDetalle);

            $resultado = $pedido[0];
            $resultado->Detalle = $detalle ?: [];
            return $resultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    private function listarConFiltros($whereExtra, $params = [])
    {
        $fecha = $this->limpiar($params['fecha'] ?? '');
        $estado = $this->limpiar($params['estado'] ?? '');

        $condiciones = [$whereExtra];
        if ($fecha !== '') {
            $condiciones[] = "p.FechaPedido = '$fecha'";
        }
        if ($estado !== '') {
            $condiciones[] = "p.Estado = '$estado'";
        }

        $whereFinal = implode(' AND ', $condiciones);

        $vSql = "SELECT p.IdPedido, p.FechaPedido, p.Estado, p.Total, c.Nombre AS ClienteNombre
                 FROM pedidos p
                 INNER JOIN clientes c ON p.IdCliente = c.IdCliente
                 WHERE $whereFinal
                 ORDER BY p.FechaPedido DESC, p.IdPedido DESC;";
        return $this->enlace->ExecuteSQL($vSql);
    }

    public function getByCliente($idUsuario, $params = [])
    {
        try {
            $cliente = $this->obtenerClientePorUsuario($idUsuario);
            if (!$cliente) {
                return [];
            }
            return $this->listarConFiltros("p.IdCliente = " . (int) $cliente->IdCliente, $params);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function getAll($params = [])
    {
        try {
            return $this->listarConFiltros("1=1", $params);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getPorEstacion($idEstacion)
    {
        try {
            $idEstacion = (int) $idEstacion;

            $vSql = "SELECT de.IdDetalleEstacion, de.Estado AS EstadoTarea,
                            dp.IdDetalle, dp.IdPedido, dp.Cantidad, dp.Observaciones,
                            COALESCE(pr.Nombre, co.Nombre) AS Nombre,
                            CASE WHEN dp.IdCombo IS NOT NULL THEN (
                                SELECT GROUP_CONCAT(
                                    CONCAT(cp.Cantidad * dp.Cantidad, 'x ', producto.Nombre)
                                    ORDER BY producto.Nombre SEPARATOR ', '
                                )
                                FROM comboproductos cp
                                INNER JOIN productos producto ON cp.IdProducto = producto.IdProducto
                                INNER JOIN productopreparacion pp
                                    ON pp.IdProducto = cp.IdProducto AND pp.Estado = 1
                                WHERE cp.IdCombo = dp.IdCombo
                                  AND pp.IdEstacion = de.IdEstacion
                                  AND pp.Orden = de.Orden
                            ) ELSE NULL END AS ProductosEstacion,
                            ped.FechaPedido, ped.Estado AS EstadoPedido,
                            c.Nombre AS ClienteNombre
                     FROM detallepedidoestacion de
                     INNER JOIN detallepedidos dp ON de.IdDetalle = dp.IdDetalle
                     INNER JOIN pedidos ped ON dp.IdPedido = ped.IdPedido
                     INNER JOIN clientes c ON ped.IdCliente = c.IdCliente
                     LEFT JOIN productos pr ON dp.IdProducto = pr.IdProducto
                     LEFT JOIN combos co ON dp.IdCombo = co.IdCombo
                     WHERE de.IdEstacion = $idEstacion
                       AND de.Estado != 'Completado'
                       AND ped.Estado NOT IN ('Entregada')
                       AND NOT EXISTS (
                           SELECT 1 FROM detallepedidoestacion anterior
                           WHERE anterior.IdDetalle = de.IdDetalle
                             AND anterior.Orden < de.Orden
                             AND anterior.Estado != 'Completado'
                       )
                     ORDER BY ped.FechaPedido ASC, dp.IdPedido ASC;";
            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function actualizarLineaEstacion($objeto)
    {
        try {
            $idDetalleEstacion = (int) ($objeto->IdDetalleEstacion ?? 0);
            if ($idDetalleEstacion <= 0) {
                throw new Exception('Registro de estación inválido');
            }

            $nuevoEstado = $this->limpiar($objeto->Estado ?? '');
            if (!in_array($nuevoEstado, ['Cola', 'En Preparación', 'Completado'])) {
                throw new Exception('Estado de tarea inválido');
            }

            $vSqlActual = "SELECT IdDetalle, Orden FROM detallepedidoestacion WHERE IdDetalleEstacion=$idDetalleEstacion;";
            $resultadoActual = $this->enlace->ExecuteSQL($vSqlActual);
            if (!$resultadoActual) {
                throw new Exception('La Estación no fue detectada');
            }
            $tareaActual = $resultadoActual[0];

            if ($nuevoEstado !== 'Cola') {
                $vSqlAnteriores = "SELECT COUNT(*) AS Pendientes FROM detallepedidoestacion
                                   WHERE IdDetalle={$tareaActual->IdDetalle}
                                     AND Orden < {$tareaActual->Orden}
                                     AND Estado != 'Completado';";
                $anteriores = $this->enlace->ExecuteSQL($vSqlAnteriores);
                if ((int) $anteriores[0]->Pendientes > 0) {
                    throw new Exception('No se puede avanzar: hay un paso anterior sin completar');
                }
            }

            $this->enlace->executeSQL_DML(
                "UPDATE detallepedidoestacion SET Estado='$nuevoEstado' WHERE IdDetalleEstacion=$idDetalleEstacion;"
            );

            $vSqlDetalle = "SELECT dp.IdDetalle, dp.IdPedido
                            FROM detallepedidoestacion de
                            INNER JOIN detallepedidos dp ON de.IdDetalle = dp.IdDetalle
                            WHERE de.IdDetalleEstacion=$idDetalleEstacion;";
            $resultado = $this->enlace->ExecuteSQL($vSqlDetalle);
            $idDetalle = (int) $resultado[0]->IdDetalle;
            $idPedido = (int) $resultado[0]->IdPedido;

            if (isset($objeto->Observaciones)) {
                $observaciones = $this->limpiar($objeto->Observaciones);
                $this->enlace->executeSQL_DML("UPDATE detallepedidos SET Observaciones='$observaciones' WHERE IdDetalle=$idDetalle;");
            }

            $vSqlPendientes = "SELECT COUNT(*) AS Pendientes
                               FROM detallepedidoestacion de
                               INNER JOIN detallepedidos dp ON de.IdDetalle = dp.IdDetalle
                               WHERE dp.IdPedido=$idPedido AND de.Estado != 'Completado';";
            $pendientes = $this->enlace->ExecuteSQL($vSqlPendientes);

            if ((int) $pendientes[0]->Pendientes === 0) {
                $this->enlace->executeSQL_DML("UPDATE pedidos SET Estado='Procesando' WHERE IdPedido=$idPedido;");
            } elseif ($nuevoEstado === 'En Preparación') {
                $this->enlace->executeSQL_DML("UPDATE pedidos SET Estado='Preparación' WHERE IdPedido=$idPedido AND Estado='Aceptada';");
            }

            return ["IdDetalleEstacion" => $idDetalleEstacion, "Actualizado" => true];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function despacharPedido($idPedido)
    {
        try {
            $idPedido = (int) $idPedido;

            $vSql = "SELECT Estado FROM pedidos WHERE IdPedido=$idPedido;";
            $resultado = $this->enlace->ExecuteSQL($vSql);
            if (!$resultado || $resultado[0]->Estado !== 'Procesando') {
                throw new Exception('El pedido debe estar en estado Procesando para poder despacharse');
            }

            $this->enlace->executeSQL_DML("UPDATE pedidos SET Estado='Entregada' WHERE IdPedido=$idPedido;");
            return $this->get($idPedido);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
