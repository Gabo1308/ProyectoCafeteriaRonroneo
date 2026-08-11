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
    
    public function getClientePropio($param)
    {
        try {
            $response = new Response();
            $model = new PedidoModel();
            $result = $model->getClientePropio($param);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function enviarCarrito()
    {
        $request = new Request();
        $response = new Response();
        $model = new PedidoModel();
        $response->toJSON($model->enviarCarrito($request->getJSON()));
    }

    public function getCarritosPendientes($param)
    {
        $response = new Response();
        $model = new PedidoModel();
        $response->toJSON($model->getCarritosPendientes($param));
    }

    public function atenderCarrito()
    {
        $request = new Request();
        $response = new Response();
        $model = new PedidoModel();
        $response->toJSON($model->atenderCarrito($request->getJSON()));
    }

    public function getPorEstacion($param)
    {
        try {
            $response = new Response();
            $model = new PedidoModel();
            $result = $model->getPorEstacion($param);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function actualizarLinea()
    {
        try {
            $request = new Request();
            $response = new Response();
            $inputJSON = $request->getJSON();
            $model = new PedidoModel();
            $result = $model->actualizarLineaEstacion($inputJSON);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function despachar($param)
    {
        try {
            $response = new Response();
            $model = new PedidoModel();
            $result = $model->despacharPedido($param);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
