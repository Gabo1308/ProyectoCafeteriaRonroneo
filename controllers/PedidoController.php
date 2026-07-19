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

    public function getByUsuario($param)
    {
        try {
            $response = new Response();
            $model = new PedidoModel();
            $result = $model->getByUsuario($param);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}