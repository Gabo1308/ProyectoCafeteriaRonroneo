import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'preparacion';
class PreparacionServices {
  getPreparaciones() {
    return axios.get(BASE_URL);
  }
  getPreparacionById(PreparacionId) {
    return axios.get(BASE_URL + '/' + PreparacionId);
  }
}
export default new PreparacionServices();
