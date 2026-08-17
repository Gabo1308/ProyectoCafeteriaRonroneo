<?php
class dashboard
{
    public function index()
    {
        $this->estadisticas();
    }

    public function estadisticas()
    {
        try {
            $response = new Response();
            $modelo = new DashboardModel();
            $result = $modelo->getEstadisticas();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}