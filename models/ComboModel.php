<?php
class ComboModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all()
    {
        try {
            $vSql = "SELECT c.*, m.Nombre AS MenuNombre,
                            CONCAT('Combo', ((c.IdCombo - 1) MOD 3) + 1, '.jpg') AS Imagen
                     FROM combos c
                     INNER JOIN menu m ON c.IdMenu = m.IdMenu;";
            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $vSql = "SELECT c.*, m.Nombre AS MenuNombre,
                            CONCAT('Combo', ((c.IdCombo - 1) MOD 3) + 1, '.jpg') AS Imagen
                     FROM combos c
                     INNER JOIN menu m ON c.IdMenu = m.IdMenu
                     WHERE c.IdCombo=$id;";
            $result = $this->enlace->ExecuteSQL($vSql);
            return $result[0];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getProductos($idCombo)
    {
        try {
            $vSql = "SELECT p.IdProducto, p.Nombre, p.Precio, p.Imagen, cp.Cantidad
                     FROM comboproductos cp
                     INNER JOIN productos p ON cp.IdProducto = p.IdProducto
                     WHERE cp.IdCombo=$idCombo;";
            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
