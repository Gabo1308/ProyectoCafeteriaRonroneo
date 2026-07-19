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
  createCombo(Combo) {
    return axios.post(BASE_URL, JSON.stringify(Combo));
  }
  updateCombo(Combo) {
    return axios.put(BASE_URL, JSON.stringify(Combo));
  }
  deleteCombo(ComboId) {
    return axios.delete(BASE_URL + '/' + ComboId);
  }
  getCombosDesactivados() {
    return axios.get(BASE_URL + "/getDesactivados");
  }
  restoreCombo(ComboId) {
    return axios.put(BASE_URL + "/restore/" + ComboId);
  }
  uploadImagenCombo(archivo) {
    const formData = new FormData();
    formData.append('imagen', archivo);
    return axios.post(BASE_URL + '/uploadImage', formData);
  }
}
export default new ComboServices();
