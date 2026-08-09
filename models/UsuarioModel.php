<?php
class UsuarioModel
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
            $vSql = "SELECT u.IdUsuario, u.IdRol, u.Nombre, u.Apellido, u.Correo, u.Estado, r.Nombre AS Rol
                    FROM usuarios u
                    INNER JOIN rol r ON u.IdRol = r.IdRol
                    WHERE u.Estado = 1
                    ORDER BY u.Nombre;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $idUsuario = (int) $id;
            $vSql = "SELECT u.IdUsuario, u.IdRol, u.Nombre, u.Apellido, u.Correo, u.Estado, r.Nombre AS Rol
                    FROM usuarios u
                    INNER JOIN rol r ON u.IdRol = r.IdRol
                    WHERE u.IdUsuario=$idUsuario;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado ? $vResultado[0] : null;
        } catch (Exception $e) {
            handleException($e);
        }
    }


    public function create($objeto)
    {
        try {
            $idRol = isset($objeto->IdRol) && $objeto->IdRol ? (int) $objeto->IdRol : 2;
            $nombre = $this->limpiar($objeto->Nombre ?? '');
            $apellido = $this->limpiar($objeto->Apellido ?? '');
            $correo = $this->limpiar($objeto->Correo ?? '');

            if ($nombre === '' || $apellido === '' || $correo === '') {
                throw new Exception('Nombre, apellido y correo son requeridos');
            }
            if (empty($objeto->Contrasena)) {
                throw new Exception('La contraseña es requerida');
            }

            $vSqlExiste = "SELECT IdUsuario FROM usuarios WHERE Correo='$correo';";
            $existente = $this->enlace->ExecuteSQL($vSqlExiste);
            if ($existente) {
                throw new Exception('Ya existe una cuenta registrada con ese correo');
            }

            $contrasena = password_hash((string) $objeto->Contrasena, PASSWORD_DEFAULT);
            if ($contrasena === false) {
                throw new Exception('No fue posible proteger la contraseña');
            }

            $vSql = "INSERT INTO usuarios (IdRol, Nombre, Apellido, Correo, Contrasena, Estado)
                    VALUES ($idRol, '$nombre', '$apellido', '$correo', '$contrasena', 1);";
            $idUsuario = $this->enlace->executeSQL_DML_last($vSql);
            return $this->get($idUsuario);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function login($objeto)
    {
        try {
            $correo = $this->limpiar($objeto->Correo ?? '');
            $contrasenaEnviada = $objeto->Contrasena ?? '';

            $vSql = "SELECT * FROM usuarios WHERE Correo='$correo' AND Estado=1;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);

            if (!$vResultado || !is_object($vResultado[0])) {
                return false;
            }

            $usuario = $vResultado[0];

            $contrasenaGuardada = (string) $usuario->Contrasena;
            $esHash = password_get_info($contrasenaGuardada)['algo'] !== null;

            if ($esHash) {
                if (!password_verify($contrasenaEnviada, $contrasenaGuardada)) {
                    return false;
                }
            } else {
                
                if (!hash_equals($contrasenaGuardada, (string) $contrasenaEnviada)) {
                    return false;
                }

                $nuevoHash = password_hash((string) $contrasenaEnviada, PASSWORD_DEFAULT);
                if ($nuevoHash === false) {
                    throw new Exception('No fue posible proteger la contraseña');
                }

                $idUsuario = (int) $usuario->IdUsuario;
                $vSqlActualizar = "UPDATE usuarios SET Contrasena='$nuevoHash' WHERE IdUsuario=$idUsuario;";
                $this->enlace->executeSQL_DML($vSqlActualizar);
            }

            $usuarioCompleto = $this->get($usuario->IdUsuario);
            if (empty($usuarioCompleto)) {
                return false;
            }

            return [
                'usuario' => $usuarioCompleto
            ];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getDesactivados()
    {
        try {
            $vSql = "SELECT u.IdUsuario, u.IdRol, u.Nombre, u.Apellido, u.Correo, u.Estado, r.Nombre AS Rol
                    FROM usuarios u
                    INNER JOIN rol r ON u.IdRol = r.IdRol
                    WHERE u.Estado = 0
                    ORDER BY u.Nombre;";
            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function crearUsuarioMantenimiento($objeto)
    {
        try {
            $idRol = (int) ($objeto->IdRol ?? 0);
            if (!in_array($idRol, [1, 2, 3])) {
                throw new Exception('Rol inválido');
            }

            $nombre = $this->limpiar($objeto->Nombre ?? '');
            $apellido = $this->limpiar($objeto->Apellido ?? '');
            $correo = $this->limpiar($objeto->Correo ?? '');

            if ($nombre === '' || $apellido === '' || $correo === '') {
                throw new Exception('Nombre, apellido y correo son requeridos');
            }
            if (empty($objeto->Contrasena)) {
                throw new Exception('La contraseña es requerida');
            }

            $vSqlExiste = "SELECT IdUsuario FROM usuarios WHERE Correo='$correo';";
            $existente = $this->enlace->ExecuteSQL($vSqlExiste);
            if ($existente) {
                throw new Exception('Ya existe una cuenta registrada con ese correo');
            }

            $contrasena = password_hash((string) $objeto->Contrasena, PASSWORD_DEFAULT);
            if ($contrasena === false) {
                throw new Exception('No fue posible proteger la contraseña');
            }

            $vSql = "INSERT INTO usuarios (IdRol, Nombre, Apellido, Correo, Contrasena, Estado)
                    VALUES ($idRol, '$nombre', '$apellido', '$correo', '$contrasena', 1);";
            $idUsuario = $this->enlace->executeSQL_DML_last($vSql);
            return $this->get($idUsuario);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function actualizarUsuario($objeto)
    {
        try {
            $idUsuario = (int) ($objeto->IdUsuario ?? 0);
            $idRol = (int) ($objeto->IdRol ?? 0);

            if ($idUsuario <= 0 || !in_array($idRol, [1, 2, 3])) {
                throw new Exception('Datos inválidos');
            }

            $nombre = $this->limpiar($objeto->Nombre ?? '');
            $apellido = $this->limpiar($objeto->Apellido ?? '');
            $correo = $this->limpiar($objeto->Correo ?? '');

            $vSqlExiste = "SELECT IdUsuario FROM usuarios WHERE Correo='$correo' AND IdUsuario != $idUsuario;";
            $existente = $this->enlace->ExecuteSQL($vSqlExiste);
            if ($existente) {
                throw new Exception('Ya existe otro usuario con ese correo');
            }

            $vSql = "UPDATE usuarios SET IdRol=$idRol, Nombre='$nombre', Apellido='$apellido', Correo='$correo'
                     WHERE IdUsuario=$idUsuario;";
            $this->enlace->executeSQL_DML($vSql);

            if (!empty($objeto->Contrasena)) {
                $nuevoHash = password_hash((string) $objeto->Contrasena, PASSWORD_DEFAULT);
                if ($nuevoHash === false) {
                    throw new Exception('No fue posible proteger la contraseña');
                }
                $this->enlace->executeSQL_DML("UPDATE usuarios SET Contrasena='$nuevoHash' WHERE IdUsuario=$idUsuario;");
            }

            return $this->get($idUsuario);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function delete($id)
    {
        try {
            $idUsuario = (int) $id;
            $this->enlace->executeSQL_DML("UPDATE usuarios SET Estado=0 WHERE IdUsuario=$idUsuario;");
            return ["IdUsuario" => $idUsuario, "Eliminado" => true];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function restore($id)
    {
        try {
            $idUsuario = (int) $id;
            $this->enlace->executeSQL_DML("UPDATE usuarios SET Estado=1 WHERE IdUsuario=$idUsuario;");
            return $this->get($idUsuario);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
