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
            if (!empty($item->IdProducto)) {
                $idProducto = (int) $item->IdProducto;
                $this->enlace->executeSQL_DML(
                    "INSERT INTO carritoproductos (IdCarrito, IdProducto, Cantidad) VALUES ($idCarrito, $idProducto, $cantidad);"
                );
            } elseif (!empty($item->IdCombo)) {
                $idCombo = (int) $item->IdCombo;
                $this->enlace->executeSQL_DML(
                    "INSERT INTO carritocombos (IdCarrito, IdCombo, Cantidad) VALUES ($idCarrito, $idCombo, $cantidad);"
                );
            }
        }

        return $idCarrito;
    }

    public function create($objeto)
    {
        try {
            $idUsuario = (int) ($objeto->IdUsuario ?? 0);
            if ($idUsuario <= 0) {
                throw new Exception('Debe iniciar sesion para completar el pedido');
            }

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
                $impuesto = round($subtotal * $tasaImpuesto);

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

            $idCarrito = $this->crearCarrito($idCliente, $objeto->items);

            $vSql = "INSERT INTO pedidos
                        (IdCliente, IdUsuario, IdCarrito, FechaPedido, Estado, Total,
                         MetodoEntrega, DireccionEntrega, CostoEnvio, TotalSinImpuesto)
                     VALUES
                        ($idCliente, $idUsuario, $idCarrito, CURDATE(), 'Pendiente de pago', $totalConImpuesto,
                         '$metodoEntrega', '$direccionEntrega', $costoEnvio, $totalSinImpuesto);";
            $idPedido = $this->enlace->executeSQL_DML_last($vSql);

            foreach ($lineasCalculadas as $linea) {
                $idProductoSql = $linea['IdProducto'] ?? 'NULL';
                $idComboSql = $linea['IdCombo'] ?? 'NULL';

                $this->enlace->executeSQL_DML(
                    "INSERT INTO detallepedidos
                        (IdPedido, IdProducto, IdCombo, Cantidad, PrecioUnitario, Subtotal, Impuesto, Observaciones)
                     VALUES
                        ($idPedido, $idProductoSql, $idComboSql, {$linea['Cantidad']}, {$linea['PrecioUnitario']},
                         {$linea['Subtotal']}, {$linea['Impuesto']}, '{$linea['Observaciones']}');"
                );
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
}