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
}
