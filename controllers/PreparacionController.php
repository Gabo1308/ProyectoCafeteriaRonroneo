<?php
class preparacion
{
    public function index()
    {
        try {
            $response = new Response();
            $model = new PreparacionModel();
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
            $model = new PreparacionModel();
            $result = $model->get($param);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getEstaciones()
    {
        try {
            $response = new Response();
            $model = new PreparacionModel();
            $result = $model->getEstaciones();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getDesactivadas()
    {
        try {
            $response = new Response();
            $model = new PreparacionModel();
            $result = $model->getDesactivadas();
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
            $model = new PreparacionModel();
            $result = $model->guardar($inputJSON);
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
            $model = new PreparacionModel();
            $result = $model->guardar($inputJSON);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function delete($param)
    {
        try {
            $response = new Response();
            $model = new PreparacionModel();
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
            $model = new PreparacionModel();
            $result = $model->restore($param);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
