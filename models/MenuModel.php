<?php
class MenuModel
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
            $vSql = "SELECT *,
                            CASE
                                WHEN IdMenu = 3 THEN 'Menu3.jpg'
                                WHEN IdMenu BETWEEN 1 AND 2 THEN CONCAT('menu', IdMenu, '.jpg')
                                ELSE 'menu1.jpg'
                            END AS Imagen
                     FROM menu
                     WHERE Estado = 1
                     ORDER BY FechaInicio ASC, HoraInicio ASC, IdMenu ASC;";
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
                     WHERE IdMenu=$idMenu
                       AND Estado = 1;";
            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getProductos($idMenu = null)
    {
        try {
            $whereMenu = $idMenu ? "AND mp.IdMenu=$idMenu" : "";
            $vSql = "SELECT p.IdProducto, p.Nombre, p.Precio, p.Imagen, c.Nombre AS Categoria
                     FROM productos p
                     INNER JOIN menuproductos mp ON p.IdProducto = mp.IdProducto
                     INNER JOIN categoria c ON p.IdCategoria = c.IdCategoria
                     WHERE p.Estado = 1
                       $whereMenu
                     ORDER BY c.Nombre, p.Nombre;";
            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    private function guardarProductos($idMenu, $productos)
    {
        $idMenu = (int) $idMenu;
        $this->enlace->executeSQL_DML("DELETE FROM menuproductos WHERE IdMenu=$idMenu;");

        if (!empty($productos) && is_array($productos)) {
            foreach ($productos as $idProducto) {
                $productoId = is_object($idProducto) ? (int) ($idProducto->IdProducto ?? 0) : (int) $idProducto;
                if ($productoId > 0) {
                    $this->enlace->executeSQL_DML(
                        "INSERT INTO menuproductos (IdMenu, IdProducto)
                         VALUES ($idMenu, $productoId);"
                    );
                }
            }
        }
    }

    public function create($objeto)
    {
        try {
            $nombre = $this->limpiar($objeto->Nombre ?? '');
            $descripcion = $this->limpiar($objeto->Descripcion ?? '');
            $horaInicio = $this->limpiar($objeto->HoraInicio ?? '00:00:00');
            $horaFin = $this->limpiar($objeto->HoraFin ?? '00:00:00');
            $diasDisponibles = $this->limpiar($objeto->DiasDisponibles ?? 'Lunes a domingo');
            $fechaInicio = $this->limpiar($objeto->FechaInicio ?? date('Y-m-d'));
            $fechaFin = $this->limpiar($objeto->FechaFin ?? date('Y-m-d'));
            $estado = isset($objeto->Estado) ? (int) $objeto->Estado : 1;

            $vSql = "INSERT INTO menu (Nombre, Descripcion, HoraInicio, HoraFin, DiasDisponibles, FechaInicio, FechaFin, Estado)
                     VALUES ('$nombre', '$descripcion', '$horaInicio', '$horaFin', '$diasDisponibles', '$fechaInicio', '$fechaFin', $estado);";
            $idMenu = $this->enlace->executeSQL_DML_last($vSql);
            $this->guardarProductos($idMenu, $objeto->productos ?? []);
            return $this->get($idMenu);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function update($objeto)
    {
        try {
            $idMenu = (int) $objeto->IdMenu;
            $nombre = $this->limpiar($objeto->Nombre ?? '');
            $descripcion = $this->limpiar($objeto->Descripcion ?? '');
            $horaInicio = $this->limpiar($objeto->HoraInicio ?? '00:00:00');
            $horaFin = $this->limpiar($objeto->HoraFin ?? '00:00:00');
            $diasDisponibles = $this->limpiar($objeto->DiasDisponibles ?? 'Lunes a domingo');
            $fechaInicio = $this->limpiar($objeto->FechaInicio ?? date('Y-m-d'));
            $fechaFin = $this->limpiar($objeto->FechaFin ?? date('Y-m-d'));
            $estado = isset($objeto->Estado) ? (int) $objeto->Estado : 1;

            $vSql = "UPDATE menu SET
                        Nombre='$nombre',
                        Descripcion='$descripcion',
                        HoraInicio='$horaInicio',
                        HoraFin='$horaFin',
                        DiasDisponibles='$diasDisponibles',
                        FechaInicio='$fechaInicio',
                        FechaFin='$fechaFin',
                        Estado=$estado
                     WHERE IdMenu=$idMenu;";
            $this->enlace->executeSQL_DML($vSql);
            $this->guardarProductos($idMenu, $objeto->productos ?? []);
            return $this->get($idMenu);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function delete($id)
    {
        try {
            $idMenu = (int) $id;
            $this->enlace->executeSQL_DML("UPDATE menu SET Estado=0 WHERE IdMenu=$idMenu;");
            $this->enlace->executeSQL_DML("UPDATE combos SET Estado=0 WHERE IdMenu=$idMenu;");
            return [
                "IdMenu" => $idMenu,
                "Eliminado" => true
            ];
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
