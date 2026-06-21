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
                            CASE
                                WHEN IdMenu = 3 THEN 'Menu3.jpg'
                                WHEN IdMenu BETWEEN 1 AND 2 THEN CONCAT('menu', IdMenu, '.jpg')
                                ELSE 'menu1.jpg'
                            END AS Imagen
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
                            CASE
                                WHEN IdMenu = 3 THEN 'Menu3.jpg'
                                WHEN IdMenu BETWEEN 1 AND 2 THEN CONCAT('menu', IdMenu, '.jpg')
                                ELSE 'menu1.jpg'
                            END AS Imagen
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
                            CASE
                                WHEN IdMenu = 3 THEN 'Menu3.jpg'
                                WHEN IdMenu BETWEEN 1 AND 2 THEN CONCAT('menu', IdMenu, '.jpg')
                                ELSE 'menu1.jpg'
                            END AS Imagen
                     FROM menu
                     WHERE FechaInicio <= CURDATE()
                       AND FechaFin >= CURDATE()
                       AND Estado = 1
                       AND (
                            HoraInicio IS NULL
                            OR HoraFin IS NULL
                            OR (HoraInicio <= HoraFin AND CURTIME() BETWEEN HoraInicio AND HoraFin)
                            OR (HoraInicio > HoraFin AND (CURTIME() >= HoraInicio OR CURTIME() <= HoraFin))
                       )
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
                            CONCAT('Combo', ((IdCombo - 1) MOD 3) + 1, '.jpg') AS Imagen
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
