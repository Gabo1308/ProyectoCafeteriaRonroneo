<?php
class DashboardModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function getTopProductos($limite = 3)
    {
        try {
            $limite = (int) $limite;
            $vSql = "SELECT p.IdProducto, p.Nombre,
                            SUM(dp.Cantidad) AS TotalPedidos
                     FROM detallepedidos dp
                     INNER JOIN productos p ON dp.IdProducto = p.IdProducto
                     WHERE dp.IdProducto IS NOT NULL
                     GROUP BY p.IdProducto, p.Nombre
                     ORDER BY TotalPedidos DESC
                     LIMIT $limite;";
            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getPedidosPorEstadoHoy()
    {
        try {
            $vSql = "SELECT Estado, COUNT(*) AS Cantidad
                     FROM pedidos
                     WHERE FechaPedido = CURDATE()
                     GROUP BY Estado
                     ORDER BY Cantidad DESC;";
            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
    public function getResumenHoy()
    {
        try {
            $vSql = "SELECT
                        COUNT(*) AS PedidosHoy,
                        COALESCE(SUM(Total), 0) AS TotalVentasHoy
                     FROM pedidos
                     WHERE FechaPedido = CURDATE();";
            $resultado = $this->enlace->ExecuteSQL($vSql);
            return $resultado ? $resultado[0] : (object) ['PedidosHoy' => 0, 'TotalVentasHoy' => 0];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getEstadisticas()
    {
        try {
            return [
                'topProductos' => $this->getTopProductos(3),
                'pedidosPorEstado' => $this->getPedidosPorEstadoHoy(),
                'resumen' => $this->getResumenHoy(),
            ];
        } catch (Exception $e) {
            handleException($e);
        }
    }
}