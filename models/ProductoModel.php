<?php
class ProductoModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all()
    {
        try {
            $vSql = "SELECT p.*, c.Nombre AS Categoria
                    FROM productos p
                    INNER JOIN categoria c ON p.IdCategoria = c.IdCategoria;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id){
        try {
            $vSql = "SELECT p.*, c.Nombre as Categoria
                    FROM productos p
                    INNER JOIN categoria c ON p.IdCategoria = c.IdCategoria
                    WHERE p.IdProducto=$id;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado[0];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getByCategoria($idCategoria)
    {
        try {
            $vSql = "SELECT p.*, c.Nombre AS Categoria
                    FROM productos p
                    INNER JOIN categoria c ON p.IdCategoria = c.IdCategoria
                    WHERE p.IdCategoria=$idCategoria;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
