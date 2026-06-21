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

    public function getProductos($param = null)
    {
        try {
            $response = new Response();
            $model = new MenuModel();
            $result = $model->getProductos($param);
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
            $model = new MenuModel();
            $result = $model->create($inputJSON);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function update()
    {
        try {
            $request = new Request();
            $response = new Response();
            $inputJSON = $request->getJSON();
            $model = new MenuModel();
            $result = $model->update($inputJSON);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function delete($param)
    {
        try {
            $response = new Response();
            $model = new MenuModel();
            $result = $model->delete($param);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
