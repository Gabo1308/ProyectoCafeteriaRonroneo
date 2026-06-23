<?php
class combo
{
    private function guardarImagen($prefijo)
    {
        if (!isset($_FILES['imagen']) || $_FILES['imagen']['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('No se recibio una imagen valida');
        }

        $archivo = $_FILES['imagen'];
        $extension = strtolower(pathinfo($archivo['name'], PATHINFO_EXTENSION));
        $extensionesPermitidas = ['jpg', 'jpeg', 'png', 'webp', 'avif'];

        if (!in_array($extension, $extensionesPermitidas)) {
            throw new Exception('Formato de imagen no permitido');
        }

        $nombreBase = pathinfo($archivo['name'], PATHINFO_FILENAME);
        $nombreBase = preg_replace('/[^A-Za-z0-9_-]/', '_', $nombreBase);
        $nombreArchivo = $prefijo . '_' . date('Ymd_His') . '_' . uniqid() . '_' . $nombreBase . '.' . $extension;

        $carpetaUploads = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'uploads';
        if (!is_dir($carpetaUploads)) {
            mkdir($carpetaUploads, 0777, true);
        }

        $rutaDestino = $carpetaUploads . DIRECTORY_SEPARATOR . $nombreArchivo;

        if (!move_uploaded_file($archivo['tmp_name'], $rutaDestino)) {
            throw new Exception('No se pudo guardar la imagen en uploads');
        }

        return $nombreArchivo;
    }

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

    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            $inputJSON = $request->getJSON();
            $model = new ComboModel();
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
            $model = new ComboModel();
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
            $model = new ComboModel();
            $result = $model->delete($param);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function uploadImage()
    {
        try {
            $response = new Response();
            $nombreArchivo = $this->guardarImagen('combo');
            $response->toJSON([
                'fileName' => $nombreArchivo,
                'url' => 'uploads/' . $nombreArchivo
            ]);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
