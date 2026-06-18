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
            $vSql = "SELECT * FROM menu;";
            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $vSql = "SELECT * FROM menu WHERE IdMenu=$id;";
            $result = $this->enlace->ExecuteSQL($vSql);
            return $result[0];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getDisponible()
    {
        try {
            $vSql = "SELECT * FROM menu
                     WHERE FechaInicio <= CURDATE()
                       AND FechaFin >= CURDATE()
                       AND Estado = 1
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
            $vSql = "SELECT * FROM combos WHERE IdMenu=$idMenu;";
            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}