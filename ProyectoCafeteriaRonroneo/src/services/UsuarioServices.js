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
}

export default new UsuarioServices();