<?php
use Firebase\JWT\JWT;

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
                    WHERE u.Estado = 1;";
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

            $contrasena = password_hash($objeto->Contrasena, PASSWORD_BCRYPT);

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

            if (!password_verify($contrasenaEnviada, $usuario->Contrasena)) {
                return false;
            }

            $usuarioCompleto = $this->get($usuario->IdUsuario);
            if (empty($usuarioCompleto)) {
                return false;
            }

            $data = [
                'IdUsuario' => $usuarioCompleto->IdUsuario,
                'Nombre' => $usuarioCompleto->Nombre,
                'Apellido' => $usuarioCompleto->Apellido,
                'Correo' => $usuarioCompleto->Correo,
                'Rol' => $usuarioCompleto->Rol,
                'iat' => time(),
                'exp' => time() + (3600 * 8) 
            ];

            $jwt_token = JWT::encode($data, Config::get('SECRET_KEY'), 'HS256');

            return [
                'token' => $jwt_token,
                'usuario' => $usuarioCompleto
            ];
        } catch (Exception $e) {
            handleException($e);
        }
    }
}