<?php
class combo
{
    public function index()
    {
        try {
            $response = new Response();
            $model = new ComboModel();
            $result = $model->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($param)
    {
        try {
            $response = new Response();
            $model = new ComboModel();
            $result = $model->get($param);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getProductos($param)
    {
        try {
            $response = new Response();
            $model = new ComboModel();
            $result = $model->getProductos($param);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}