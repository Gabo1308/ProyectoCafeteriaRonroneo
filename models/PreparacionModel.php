<?php
class PreparacionModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all()
    {
        try {
            $vSql = "SELECT p.IdProducto AS IdPreparacion,
                            p.Nombre AS Producto,
                            COUNT(pp.IdEstacion) AS CantidadPasos
                     FROM productos p
                     INNER JOIN productopreparacion pp ON p.IdProducto = pp.IdProducto
                     GROUP BY p.IdProducto, p.Nombre
                     ORDER BY p.Nombre;";
            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $vSqlProducto = "SELECT IdProducto, Nombre AS Producto
                             FROM productos
                             WHERE IdProducto=$id;";
            $producto = $this->enlace->ExecuteSQL($vSqlProducto);

            $vSqlEstaciones = "SELECT e.Nombre AS Estacion, pp.Orden
                               FROM productopreparacion pp
                               INNER JOIN estaciones e ON pp.IdEstacion = e.IdEstacion
                               WHERE pp.IdProducto=$id
                               ORDER BY pp.Orden DESC;";
            $estaciones = $this->enlace->ExecuteSQL($vSqlEstaciones);

            return [
                "IdProducto" => $producto[0]->IdProducto,
                "Producto" => $producto[0]->Producto,
                "Estaciones" => $estaciones
            ];
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
