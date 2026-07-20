<?php
class ingrediente
{
    public function index()
    {
        try {
            $response = new Response();
            $ingrediente = new IngredienteModel();
            $response->toJSON($ingrediente->all());
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
