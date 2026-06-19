import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'categoria';
class CategoriaServices {
  getCategorias() {
    return axios.get(BASE_URL);
  }
  getCategoriaById(CategoriaId) {
    return axios.get(BASE_URL + '/' + CategoriaId);
  }
}
export default new CategoriaServices();