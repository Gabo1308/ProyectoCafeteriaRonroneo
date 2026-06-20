<?php
class MenuModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all()
    {
        try {
            $vSql = "SELECT *,
                            CASE WHEN IdMenu BETWEEN 1 AND 3 THEN CONCAT('menu', IdMenu, '.jpg') ELSE 'menu1.jpg' END AS Imagen
                     FROM menu
                     ORDER BY FechaInicio DESC, FechaFin DESC;";
            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $vSql = "SELECT *,
                            CASE WHEN IdMenu BETWEEN 1 AND 3 THEN CONCAT('menu', IdMenu, '.jpg') ELSE 'menu1.jpg' END AS Imagen
                     FROM menu
                     WHERE IdMenu=$id;";
            $result = $this->enlace->ExecuteSQL($vSql);
            return $result[0];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getDisponible()
    {
        try {
            $vSql = "SELECT *,
                            CASE WHEN IdMenu BETWEEN 1 AND 3 THEN CONCAT('menu', IdMenu, '.jpg') ELSE 'menu1.jpg' END AS Imagen
                     FROM menu
                     WHERE FechaInicio <= CURDATE()
                       AND FechaFin >= CURDATE()
                       AND Estado = 1
                     ORDER BY FechaInicio DESC
                     LIMIT 1;";
            $result = $this->enlace->ExecuteSQL($vSql);
            return $result ? $result[0] : null;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getCombos($idMenu)
    {
        try {
            $vSql = "SELECT *,
                            CASE WHEN IdCombo BETWEEN 1 AND 3 THEN CONCAT('Combo', IdCombo, '.jpg') ELSE 'Combo1.jpg' END AS Imagen
                     FROM combos
                     WHERE IdMenu=$idMenu;";
            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getProductos()
    {
        try {
            $vSql = "SELECT p.IdProducto, p.Nombre, p.Precio, p.Imagen, c.Nombre AS Categoria
                     FROM productos p
                     INNER JOIN categoria c ON p.IdCategoria = c.IdCategoria
                     WHERE p.Estado = 1
                     ORDER BY c.Nombre, p.Nombre;";
            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
