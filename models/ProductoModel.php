<?php
class ProductoModel
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

    public function all()
    {
        try {
            $vSql = "SELECT p.*, c.Nombre AS Categoria
                    FROM productos p
                    INNER JOIN categoria c ON p.IdCategoria = c.IdCategoria
                    WHERE p.Estado = 1;";
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
                    WHERE p.IdCategoria=$idCategoria
                      AND p.Estado = 1;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create($objeto)
    {
        try {
            $idCategoria = (int) $objeto->IdCategoria;
            $nombre = $this->limpiar($objeto->Nombre ?? '');
            $descripcion = $this->limpiar($objeto->Descripcion ?? '');
            $ingredientes = $this->limpiar($objeto->ingredientes ?? $objeto->Ingredientes ?? '');
            $imagen = $this->limpiar($objeto->Imagen ?? '');
            $precio = (float) ($objeto->Precio ?? 0);
            $estado = isset($objeto->Estado) ? (int) $objeto->Estado : 1;

            $vSql = "INSERT INTO productos (IdCategoria, Nombre, Descripcion, ingredientes, Imagen, Precio, Estado)
                    VALUES ($idCategoria, '$nombre', '$descripcion', '$ingredientes', '$imagen', $precio, $estado);";
            $idProducto = $this->enlace->executeSQL_DML_last($vSql);
            return $this->get($idProducto);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function update($objeto)
    {
        try {
            $idProducto = (int) $objeto->IdProducto;
            $idCategoria = (int) $objeto->IdCategoria;
            $nombre = $this->limpiar($objeto->Nombre ?? '');
            $descripcion = $this->limpiar($objeto->Descripcion ?? '');
            $ingredientes = $this->limpiar($objeto->ingredientes ?? $objeto->Ingredientes ?? '');
            $imagen = $this->limpiar($objeto->Imagen ?? '');
            $precio = (float) ($objeto->Precio ?? 0);
            $estado = isset($objeto->Estado) ? (int) $objeto->Estado : 1;

            $vSql = "UPDATE productos SET
                        IdCategoria=$idCategoria,
                        Nombre='$nombre',
                        Descripcion='$descripcion',
                        ingredientes='$ingredientes',
                        Imagen='$imagen',
                        Precio=$precio,
                        Estado=$estado
                     WHERE IdProducto=$idProducto;";
            $this->enlace->executeSQL_DML($vSql);
            return $this->get($idProducto);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function delete($id)
    {
        try {
            $idProducto = (int) $id;
            $vSql = "UPDATE productos SET Estado=0 WHERE IdProducto=$idProducto;";
            $this->enlace->executeSQL_DML($vSql);
            return [
                "IdProducto" => $idProducto,
                "Eliminado" => true
            ];
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
