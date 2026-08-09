<?php
class usuario
{
    public function index()
    {
        try {
            $response = new Response();
            $usuarioModel = new UsuarioModel();
            $result = $usuarioModel->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($param)
    {
        try {
            $response = new Response();
            $usuarioModel = new UsuarioModel();
            $result = $usuarioModel->get($param);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            $inputJSON = $request->getJSON();
            $usuarioModel = new UsuarioModel();
            $result = $usuarioModel->create($inputJSON);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function login()
    {
        try {
            $request = new Request();
            $response = new Response();
            $inputJSON = $request->getJSON();
            $usuarioModel = new UsuarioModel();
            $result = $usuarioModel->login($inputJSON);

            if (isset($result) && !empty($result) && $result != false) {
            $response->toJSON($result);
            } else {
                http_response_code(401);
                $response->toJSON(["mensaje" => "Usuario o contraseña incorrectos"]);
            }

        } catch (Exception $e) {
            handleException($e);
        }
    }

     public function getDesactivados()
    {
        try {
            $response = new Response();
            $model = new UsuarioModel();
            $result = $model->getDesactivados();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function crearUsuarioMantenimiento()
    {
        try {
            $request = new Request();
            $response = new Response();
            $inputJSON = $request->getJSON();
            $model = new UsuarioModel();
            $result = $model->crearUsuarioMantenimiento($inputJSON);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function actualizarUsuario()
    {
        try {
            $request = new Request();
            $response = new Response();
            $inputJSON = $request->getJSON();
            $model = new UsuarioModel();
            $result = $model->actualizarUsuario($inputJSON);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function delete($param)
    {
        try {
            $response = new Response();
            $model = new UsuarioModel();
            $result = $model->delete($param);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function restore($param)
    {
        try {
            $response = new Response();
            $model = new UsuarioModel();
            $result = $model->restore($param);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}