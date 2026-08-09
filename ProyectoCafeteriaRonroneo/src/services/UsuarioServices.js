import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'usuario';

class UsuarioServices {
  getUsuarios() {
    return axios.get(BASE_URL);
  }
  getUsuarioById(IdUsuario) {
    return axios.get(BASE_URL + '/' + IdUsuario);
  }
  registrar(Usuario) {
    return axios.post(BASE_URL, JSON.stringify(Usuario));
  }
  login(Credenciales) {
    return axios.post(BASE_URL + '/login', JSON.stringify(Credenciales));
  }
  getUsuariosDesactivados() {
    return axios.get(BASE_URL + '/getDesactivados');
  }
  crearUsuario(usuario) {
    return axios.post(BASE_URL + '/crearUsuarioMantenimiento', JSON.stringify(usuario));
  }
  actualizarUsuario(usuario) {
    return axios.put(BASE_URL + '/actualizarUsuario', JSON.stringify(usuario));
  }
  deleteUsuario(idUsuario) {
    return axios.delete(BASE_URL + '/' + idUsuario);
  }
  restoreUsuario(idUsuario) {
    return axios.put(BASE_URL + '/restore/' + idUsuario);
  }
}

export default new UsuarioServices();