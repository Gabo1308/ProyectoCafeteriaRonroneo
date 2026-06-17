<?php
class producto
{
    public function index()
    {
        try {
            $response = new Response();
            $producto = new ProductoModel();
            $result = $producto->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($param)
    {
        try {
            $response = new Response();
            $producto = new ProductoModel();
            $result = $producto->get($param);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getByCategoria($param)
    {
        try {
            $response = new Response();
            $producto = new ProductoModel();
            $result = $producto->getByCategoria($param);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}

