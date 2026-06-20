<?php
class menu
{
    public function index()
    {
        try {
            $response = new Response();
            $model = new MenuModel();
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
            $model = new MenuModel();
            $result = $model->get($param);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getDisponible()
    {
        try {
            $response = new Response();
            $model = new MenuModel();
            $result = $model->getDisponible();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getCombos($param)
    {
        try {
            $response = new Response();
            $model = new MenuModel();
            $result = $model->getCombos($param);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getProductos()
    {
        try {
            $response = new Response();
            $model = new MenuModel();
            $result = $model->getProductos();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
