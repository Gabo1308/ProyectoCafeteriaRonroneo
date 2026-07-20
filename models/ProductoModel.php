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
        return trim((string) $valor);
    }

    private function adjuntarIngredientes($productos)
    {
        if (empty($productos)) {
            return $productos;
        }

        $idsProductos = array_map(
            fn($producto) => (int) $producto->IdProducto,
            $productos
        );
        $idsSql = implode(',', $idsProductos);
        $relaciones = $this->enlace->ExecuteSQL(
            "SELECT pi.IdProducto, i.IdIngrediente, i.Nombre
             FROM productoingredientes pi
             INNER JOIN ingredientes i ON pi.IdIngrediente = i.IdIngrediente
             WHERE pi.IdProducto IN ($idsSql)
             ORDER BY i.Nombre;"
        ) ?? [];

        $ingredientesPorProducto = [];
        foreach ($relaciones as $relacion) {
            $idProducto = (int) $relacion->IdProducto;
            $ingredientesPorProducto[$idProducto][] = (object) [
                'IdIngrediente' => (int) $relacion->IdIngrediente,
                'Nombre' => $relacion->Nombre
            ];
        }

        foreach ($productos as $producto) {
            $idProducto = (int) $producto->IdProducto;
            $ingredientes = $ingredientesPorProducto[$idProducto] ?? [];
            usort(
                $ingredientes,
                fn($a, $b) => strcasecmp($a->Nombre, $b->Nombre)
            );
            $producto->Ingredientes = $ingredientes;
        }

        return $productos;
    }

    private function normalizarIngredientes($ingredientes)
    {
        if ($ingredientes === null) {
            return [];
        }

        if (!is_array($ingredientes)) {
            throw new InvalidArgumentException('Los ingredientes deben enviarse como una lista de identificadores');
        }

        $ids = [];
        foreach ($ingredientes as $idIngrediente) {
            if ((!is_int($idIngrediente) && !ctype_digit((string) $idIngrediente)) || (int) $idIngrediente <= 0) {
                throw new InvalidArgumentException('La lista contiene un ingrediente invalido');
            }
            $ids[] = (int) $idIngrediente;
        }

        if (count($ids) !== count(array_unique($ids))) {
            throw new InvalidArgumentException('No se permiten ingredientes duplicados');
        }

        if (!empty($ids)) {
            $idsSql = implode(',', $ids);
            $existentes = $this->enlace->ExecuteSQL(
                "SELECT IdIngrediente FROM ingredientes WHERE IdIngrediente IN ($idsSql);"
            ) ?? [];

            if (count($existentes) !== count($ids)) {
                throw new InvalidArgumentException('Uno o mas ingredientes no existen en el catalogo');
            }
        }

        return $ids;
    }

    private function guardarIngredientes(mysqli $conexion, $idProducto, $ingredientes, $reemplazar = false)
    {
        if ($reemplazar) {
            $eliminar = $conexion->prepare(
                'DELETE FROM productoingredientes WHERE IdProducto = ?'
            );
            $eliminar->bind_param('i', $idProducto);
            $eliminar->execute();
        }

        if (empty($ingredientes)) {
            return;
        }

        $insertar = $conexion->prepare(
            'INSERT INTO productoingredientes (IdProducto, IdIngrediente) VALUES (?, ?)'
        );
        foreach ($ingredientes as $idIngrediente) {
            $insertar->bind_param('ii', $idProducto, $idIngrediente);
            $insertar->execute();
        }
    }

    public function all()
    {
        try {
            $vSql = "SELECT p.*, c.Nombre AS Categoria
                     FROM productos p
                     INNER JOIN categoria c ON p.IdCategoria = c.IdCategoria
                     WHERE p.Estado = 1;";
            return $this->adjuntarIngredientes($this->enlace->ExecuteSQL($vSql) ?? []);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $idProducto = (int) $id;
            $vSql = "SELECT p.*, c.Nombre AS Categoria
                     FROM productos p
                     INNER JOIN categoria c ON p.IdCategoria = c.IdCategoria
                     WHERE p.IdProducto=$idProducto;";
            $resultado = $this->adjuntarIngredientes($this->enlace->ExecuteSQL($vSql) ?? []);
            return $resultado[0] ?? null;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getDesactivados()
    {
        try {
            $vSql = "SELECT p.*, c.Nombre AS Categoria
                     FROM productos p
                     INNER JOIN categoria c ON p.IdCategoria = c.IdCategoria
                     WHERE p.Estado = 0;";
            return $this->adjuntarIngredientes($this->enlace->ExecuteSQL($vSql) ?? []);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getByCategoria($idCategoria)
    {
        try {
            $idCategoria = (int) $idCategoria;
            $vSql = "SELECT p.*, c.Nombre AS Categoria
                     FROM productos p
                     INNER JOIN categoria c ON p.IdCategoria = c.IdCategoria
                     WHERE p.IdCategoria=$idCategoria
                       AND p.Estado = 1;";
            return $this->adjuntarIngredientes($this->enlace->ExecuteSQL($vSql) ?? []);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create($objeto)
    {
        $idCategoria = (int) ($objeto->IdCategoria ?? 0);
        $nombre = $this->limpiar($objeto->Nombre ?? '');
        $descripcion = $this->limpiar($objeto->Descripcion ?? '');
        $imagen = $this->limpiar($objeto->Imagen ?? '');
        $precio = (float) ($objeto->Precio ?? 0);
        $estado = isset($objeto->Estado) ? (int) $objeto->Estado : 1;
        $ingredientes = $this->normalizarIngredientes($objeto->ingredientes ?? null);

        if ($idCategoria <= 0 || $nombre === '' || $precio < 0) {
            throw new InvalidArgumentException('Categoria, nombre y precio valido son requeridos');
        }

        $idProducto = $this->enlace->transaction(
            function (mysqli $conexion) use ($idCategoria, $nombre, $descripcion, $imagen, $precio, $estado, $ingredientes) {
                $buscar = $conexion->prepare(
                    'SELECT IdProducto FROM productos WHERE Nombre = ? AND Estado = 1'
                );
                $buscar->bind_param('s', $nombre);
                $buscar->execute();
                if ($buscar->get_result()->num_rows > 0) {
                    throw new InvalidArgumentException('Ya existe un producto con ese nombre');
                }

                $insertar = $conexion->prepare(
                    'INSERT INTO productos (IdCategoria, Nombre, Descripcion, Imagen, Precio, Estado)
                     VALUES (?, ?, ?, ?, ?, ?)'
                );
                $insertar->bind_param('isssdi', $idCategoria, $nombre, $descripcion, $imagen, $precio, $estado);
                $insertar->execute();
                $nuevoId = $conexion->insert_id;

                $this->guardarIngredientes($conexion, $nuevoId, $ingredientes);
                return $nuevoId;
            }
        );

        return $this->get($idProducto);
    }

    public function update($objeto)
    {
        $idProducto = (int) ($objeto->IdProducto ?? 0);
        $idCategoria = (int) ($objeto->IdCategoria ?? 0);
        $nombre = $this->limpiar($objeto->Nombre ?? '');
        $descripcion = $this->limpiar($objeto->Descripcion ?? '');
        $imagen = $this->limpiar($objeto->Imagen ?? '');
        $precio = (float) ($objeto->Precio ?? 0);
        $estado = isset($objeto->Estado) ? (int) $objeto->Estado : 1;
        $ingredientes = $this->normalizarIngredientes($objeto->ingredientes ?? null);

        if ($idProducto <= 0 || $idCategoria <= 0 || $nombre === '' || $precio < 0) {
            throw new InvalidArgumentException('Producto, categoria, nombre y precio valido son requeridos');
        }

        $this->enlace->transaction(
            function (mysqli $conexion) use ($idProducto, $idCategoria, $nombre, $descripcion, $imagen, $precio, $estado, $ingredientes) {
                $buscarProducto = $conexion->prepare(
                    'SELECT IdProducto FROM productos WHERE IdProducto = ?'
                );
                $buscarProducto->bind_param('i', $idProducto);
                $buscarProducto->execute();
                if ($buscarProducto->get_result()->num_rows === 0) {
                    throw new InvalidArgumentException('El producto indicado no existe');
                }

                $buscarNombre = $conexion->prepare(
                    'SELECT IdProducto FROM productos
                     WHERE Nombre = ? AND Estado = 1 AND IdProducto <> ?'
                );
                $buscarNombre->bind_param('si', $nombre, $idProducto);
                $buscarNombre->execute();
                if ($buscarNombre->get_result()->num_rows > 0) {
                    throw new InvalidArgumentException('Ya existe otro producto con ese nombre');
                }

                $actualizar = $conexion->prepare(
                    'UPDATE productos SET
                        IdCategoria = ?, Nombre = ?, Descripcion = ?, Imagen = ?, Precio = ?, Estado = ?
                     WHERE IdProducto = ?'
                );
                $actualizar->bind_param(
                    'isssdii',
                    $idCategoria,
                    $nombre,
                    $descripcion,
                    $imagen,
                    $precio,
                    $estado,
                    $idProducto
                );
                $actualizar->execute();

                $this->guardarIngredientes($conexion, $idProducto, $ingredientes, true);
            }
        );

        return $this->get($idProducto);
    }

    public function delete($id)
    {
        try {
            $idProducto = (int) $id;
            $this->enlace->executeSQL_DML(
                "UPDATE productos SET Estado=0 WHERE IdProducto=$idProducto;"
            );
            return [
                'IdProducto' => $idProducto,
                'Eliminado' => true
            ];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function restore($id)
    {
        try {
            $idProducto = (int) $id;
            $this->enlace->executeSQL_DML(
                "UPDATE productos SET Estado=1 WHERE IdProducto=$idProducto;"
            );
            return [
                'IdProducto' => $idProducto,
                'Estado' => 1,
                'Mensaje' => 'Producto restaurado correctamente.'
            ];
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
