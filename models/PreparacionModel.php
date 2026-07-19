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
                     WHERE pp.Estado = 1
                     GROUP BY p.IdProducto, p.Nombre
                     ORDER BY p.Nombre;";
            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getDesactivadas()
    {
        try {
            $vSql = "SELECT p.IdProducto AS IdPreparacion,
                            p.Nombre AS Producto,
                            COUNT(pp.IdEstacion) AS CantidadPasos
                     FROM productos p
                     INNER JOIN productopreparacion pp ON p.IdProducto = pp.IdProducto
                     WHERE pp.Estado = 0
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

            $vSqlEstaciones = "SELECT pp.IdEstacion, e.Nombre AS Estacion, pp.Orden
                               FROM productopreparacion pp
                               INNER JOIN estaciones e ON pp.IdEstacion = e.IdEstacion
                               WHERE pp.IdProducto=$id
                               ORDER BY pp.Orden ASC;";
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

    public function getEstaciones()
    {
        try {
            $vSql = "SELECT IdEstacion, Nombre FROM estaciones ORDER BY Nombre;";
            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function guardar($objeto)
    {
        try {
            $idProducto = (int) ($objeto->IdProducto ?? 0);
            if ($idProducto <= 0) {
                throw new Exception('Debe seleccionar un producto');
            }
            if (empty($objeto->Estaciones) || !is_array($objeto->Estaciones)) {
                throw new Exception('Debe agregar al menos una estacion');
            }

            $this->enlace->executeSQL_DML("DELETE FROM productopreparacion WHERE IdProducto=$idProducto;");

            foreach ($objeto->Estaciones as $estacion) {
                $idEstacion = (int) ($estacion->IdEstacion ?? 0);
                $orden = (int) ($estacion->Orden ?? 1);
                if ($idEstacion > 0) {
                    $this->enlace->executeSQL_DML(
                        "INSERT INTO productopreparacion (IdProducto, IdEstacion, Orden, Estado)
                         VALUES ($idProducto, $idEstacion, $orden, 1);"
                    );
                }
            }

            return $this->get($idProducto);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function delete($idProducto)
    {
        try {
            $idProducto = (int) $idProducto;
            $this->enlace->executeSQL_DML("UPDATE productopreparacion SET Estado=0 WHERE IdProducto=$idProducto;");
            return [
                "IdProducto" => $idProducto,
                "Eliminado" => true
            ];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function restore($idProducto)
    {
        try {
            $idProducto = (int) $idProducto;
            $this->enlace->executeSQL_DML("UPDATE productopreparacion SET Estado=1 WHERE IdProducto=$idProducto;");
            return $this->get($idProducto);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}

