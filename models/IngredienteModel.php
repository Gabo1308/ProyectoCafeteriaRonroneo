<?php
class IngredienteModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all()
    {
        try {
            $vSql = "SELECT IdIngrediente, Nombre
                     FROM ingredientes
                     ORDER BY Nombre;";
            return $this->enlace->ExecuteSQL($vSql) ?? [];
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
