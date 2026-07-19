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

    private function obtenerOCrearCliente($idUsuario, $nombre, $telefono, $correo, $direccion)
    {
        $idUsuario = (int) $idUsuario;
        $vSql = "SELECT IdCliente FROM clientes WHERE IdUsuario=$idUsuario;";
        $existente = $this->enlace->ExecuteSQL($vSql);

        $telefonoLimpio = $this->limpiar($telefono);
        $direccionLimpia = $this->limpiar($direccion);

        if ($existente) {
            $idCliente = (int) $existente[0]->IdCliente;
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
        $vSql = "INSERT INTO carritos (IdCliente, FechaCreacion, Estado)
                 VALUES ($idCliente, CURDATE(), 1);";
        $idCarrito = $this->enlace->executeSQL_DML_last($vSql);

        foreach ($items as $item) {
            $cantidad = (int) ($item->Cantidad ?? 1);

            if (!empty($item->IdProducto)) {
                $idProducto = (int) $item->IdProducto;
                $this->enlace->executeSQL_DML(
                    "INSERT INTO carritoproductos (IdCarrito, IdProducto, Cantidad)
                     VALUES ($idCarrito, $idProducto, $cantidad);"
                );
            } elseif (!empty($item->IdCombo)) {
                $idCombo = (int) $item->IdCombo;
                $this->enlace->executeSQL_DML(
                    "INSERT INTO carritocombos (IdCarrito, IdCombo, Cantidad)
                     VALUES ($idCarrito, $idCombo, $cantidad);"
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
                throw new Exception('El carrito esta vacio');
            }

            $idCliente = $this->obtenerOCrearCliente(
                $idUsuario,
                $objeto->Nombre ?? '',
                $objeto->Telefono ?? '',
                $objeto->Correo ?? '',
                $objeto->Direccion ?? ''
            );

            $idCarrito = $this->crearCarrito($idCliente, $objeto->items);

            $total = (float) ($objeto->Total ?? 0);

            $vSql = "INSERT INTO pedidos (IdCliente, IdUsuario, IdCarrito, FechaPedido, Estado, Total)
                     VALUES ($idCliente, $idUsuario, $idCarrito, CURDATE(), 1, $total);";
            $idPedido = $this->enlace->executeSQL_DML_last($vSql);

            foreach ($objeto->items as $item) {
                $idProducto = !empty($item->IdProducto) ? (int) $item->IdProducto : 'NULL';
                $idCombo = !empty($item->IdCombo) ? (int) $item->IdCombo : 'NULL';
                $cantidad = (int) ($item->Cantidad ?? 1);
                $precioUnitario = (float) ($item->PrecioUnitario ?? 0);
                $subtotal = (float) ($item->Subtotal ?? ($precioUnitario * $cantidad));

                $this->enlace->executeSQL_DML(
                    "INSERT INTO detallepedidos (IdPedido, IdProducto, IdCombo, Cantidad, PrecioUnitario, Subtotal)
                     VALUES ($idPedido, $idProducto, $idCombo, $cantidad, $precioUnitario, $subtotal);"
                );
            }

            $metodoPago = $this->limpiar($objeto->MetodoPago ?? 'Efectivo');
            $this->enlace->executeSQL_DML(
                "INSERT INTO pagos (IdPedido, MetodoPago, Monto, FechaPago, Estado)
                 VALUES ($idPedido, '$metodoPago', $total, CURDATE(), 1);"
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
            $vSql = "SELECT * FROM pedidos WHERE IdPedido=$idPedido;";
            $result = $this->enlace->ExecuteSQL($vSql);
            return $result ? $result[0] : null;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getByUsuario($idUsuario)
    {
        try {
            $idUsuario = (int) $idUsuario;
            $vSql = "SELECT * FROM pedidos WHERE IdUsuario=$idUsuario ORDER BY FechaPedido DESC, IdPedido DESC;";
            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}