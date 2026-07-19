import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'preparacion';
class PreparacionServices {
  getPreparaciones() {
    return axios.get(BASE_URL);
  }
  getPreparacionById(PreparacionId) {
    return axios.get(BASE_URL + '/' + PreparacionId);
  }
  getEstaciones() {
    return axios.get(BASE_URL + '/getEstaciones');
  }
  guardarPreparacion(Preparacion) {
    return Preparacion.esNueva
      ? axios.post(BASE_URL, JSON.stringify(Preparacion))
      : axios.put(BASE_URL, JSON.stringify(Preparacion));
  }
  deletePreparacion(IdProducto) {
    return axios.delete(BASE_URL + '/' + IdProducto);
  }
  getPreparacionesDesactivadas() {
    return axios.get(BASE_URL + '/getDesactivadas');
  }
  restorePreparacion(IdProducto) {
    return axios.put(BASE_URL + '/restore/' + IdProducto);
  }
}
export default new PreparacionServices();