import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'combo';
class ComboServices {
  getCombos() {
    return axios.get(BASE_URL);
  }
  getComboById(ComboId) {
    return axios.get(BASE_URL + '/' + ComboId);
  }
  getProductosByCombo(ComboId) {
    return axios.get(BASE_URL + '/getProductos/' + ComboId);
  }
}
export default new ComboServices();