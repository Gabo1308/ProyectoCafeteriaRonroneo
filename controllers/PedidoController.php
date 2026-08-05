<?php
class pedido
{
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            $inputJSON = $request->getJSON();
            $model = new PedidoModel();
            $result = $model->create($inputJSON);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($param)
    {
        try {
            $response = new Response();
            $model = new PedidoModel();
            $result = $model->get($param);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getByCliente($param)
    {
        try {
            $response = new Response();
            $model = new PedidoModel();
            $result = $model->getByCliente($param, $_GET);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getAll()
    {
        try {
            $response = new Response();
            $model = new PedidoModel();
            $result = $model->getAll($_GET);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getClientes()
    {
        try {
            $response = new Response();
            $model = new PedidoModel();
            $result = $model->getClientes();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}