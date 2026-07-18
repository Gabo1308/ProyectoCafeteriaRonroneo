<?php
class RolModel{
    public $enlace;

    public function __construct() {
        
        $this->enlace=new MySqlConnect();
       
    }
    
    public function all(){
        try {
            $vSql = "SELECT * FROM rol;";
            
            $vResultado = $this->enlace->ExecuteSQL ( $vSql);
                
            return $vResultado;
        } catch ( Exception $e ) {
            die ( $e->getMessage () );
        }
    }

    public function get($id){
        try {
            $vSql = "SELECT * FROM rol where id=$id";
            
            $vResultado = $this->enlace->ExecuteSQL ( $vSql);
            return $vResultado[0];
        } catch ( Exception $e ) {
            die ( $e->getMessage () );
        }
    }

    public function getUsuarioRol($idUsuario)
    {
        try {
            $vSql = "SELECT r.IdRol, r.Nombre
                    FROM rol r
                    INNER JOIN usuarios u ON r.IdRol = u.IdRol
                    WHERE u.IdUsuario = $idUsuario";
            
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado[0];
        } catch (Exception $e) {
            die($e->getMessage());
        }
    }
    
}
