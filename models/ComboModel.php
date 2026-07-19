<?php
class ComboModel
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
            $vSql = "SELECT c.IdCombo, c.IdMenu, c.Nombre, c.Descripcion, c.Precio, c.Estado,
                            m.Nombre AS MenuNombre,
                            COALESCE(NULLIF(c.Imagen, ''), CONCAT('Combo', ((c.IdCombo - 1) MOD 3) + 1, '.jpg')) AS Imagen
                     FROM combos c
                     INNER JOIN menu m ON c.IdMenu = m.IdMenu
                     WHERE c.Estado = 1;";
            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $vSql = "SELECT c.IdCombo, c.IdMenu, c.Nombre, c.Descripcion, c.Precio, c.Estado,
                            m.Nombre AS MenuNombre,
                            COALESCE(NULLIF(c.Imagen, ''), CONCAT('Combo', ((c.IdCombo - 1) MOD 3) + 1, '.jpg')) AS Imagen
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

    private function guardarProductos($idCombo, $productos)
    {
        $idCombo = (int) $idCombo;
        $this->enlace->executeSQL_DML("DELETE FROM comboproductos WHERE IdCombo=$idCombo;");

        if (!empty($productos) && is_array($productos)) {
            foreach ($productos as $producto) {
                $idProducto = (int) ($producto->IdProducto ?? $producto->id ?? 0);
                $cantidad = (int) ($producto->Cantidad ?? $producto->cantidad ?? 1);
                if ($idProducto > 0 && $cantidad > 0) {
                    $this->enlace->executeSQL_DML(
                        "INSERT INTO comboproductos (IdCombo, IdProducto, Cantidad)
                         VALUES ($idCombo, $idProducto, $cantidad);"
                    );
                }
            }
        }
    }

    public function create($objeto)
    {
        try {
            $idMenu = (int) $objeto->IdMenu;
            $nombre = $this->limpiar($objeto->Nombre ?? '');
            $descripcion = $this->limpiar($objeto->Descripcion ?? '');
            $imagen = $this->limpiar($objeto->Imagen ?? '');
            $precio = (float) ($objeto->Precio ?? 0);
            $estado = isset($objeto->Estado) ? (int) $objeto->Estado : 1;

            $vSql = "INSERT INTO combos (IdMenu, Nombre, Descripcion, Imagen, Precio, Estado)
                    VALUES ($idMenu, '$nombre', '$descripcion', '$imagen', $precio, $estado);";
            $idCombo = $this->enlace->executeSQL_DML_last($vSql);
            $this->guardarProductos($idCombo, $objeto->productos ?? []);
            return $this->get($idCombo);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function update($objeto)
    {
        try {
            $idCombo = (int) $objeto->IdCombo;
            $idMenu = (int) $objeto->IdMenu;
            $nombre = $this->limpiar($objeto->Nombre ?? '');
            $descripcion = $this->limpiar($objeto->Descripcion ?? '');
            $imagen = $this->limpiar($objeto->Imagen ?? '');
            $precio = (float) ($objeto->Precio ?? 0);
            $estado = isset($objeto->Estado) ? (int) $objeto->Estado : 1;

            $vSql = "UPDATE combos SET
                        IdMenu=$idMenu,
                        Nombre='$nombre',
                        Descripcion='$descripcion',
                        Imagen='$imagen',
                        Precio=$precio,
                        Estado=$estado
                     WHERE IdCombo=$idCombo;";
            $this->enlace->executeSQL_DML($vSql);
            $this->guardarProductos($idCombo, $objeto->productos ?? []);
            return $this->get($idCombo);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function delete($id)
    {
        try {
            $idCombo = (int) $id;
            $vSql = "UPDATE combos SET Estado=0 WHERE IdCombo=$idCombo;";
            $this->enlace->executeSQL_DML($vSql);
            return [
                "IdCombo" => $idCombo,
                "Eliminado" => true
            ];
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
    public function getDesactivados()
    {
        try {
            $vSql = "SELECT c.IdCombo, c.IdMenu, c.Nombre, c.Descripcion, c.Precio, c.Estado,
                            m.Nombre AS MenuNombre,
                            COALESCE(NULLIF(c.Imagen, ''), CONCAT('Combo', ((c.IdCombo - 1) MOD 3) + 1, '.jpg')) AS Imagen
                     FROM combos c
                     INNER JOIN menu m ON c.IdMenu = m.IdMenu
                     WHERE c.Estado = 0;";
            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function restore($id)
    {
        try {
            $idCombo = (int) $id;
            $vSql = "UPDATE combos SET Estado=1 WHERE IdCombo=$idCombo;";
            $this->enlace->executeSQL_DML($vSql);
            return $this->get($idCombo);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
