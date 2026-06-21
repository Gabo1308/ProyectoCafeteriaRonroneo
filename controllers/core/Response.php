<?php

class Response
{
    private $status = 200;

    public function status(int $code)
    {
        $this->status = $code;
        return $this;
    }
    
    public function toJSON($response = [],$message="")
    {
        if ($message !== "" && (is_null($response) || $response === [] || $response === "")) {
            $this->status = 400;
            $json = $message;
        } else {
            $json = $response;
        }
        //Escribir respuesta JSON con código de estado HTTP
        echo json_encode(
            $json,
            http_response_code($this->status)
        );
    }
}
