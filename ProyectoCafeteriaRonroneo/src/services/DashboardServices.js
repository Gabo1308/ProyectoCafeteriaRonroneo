import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'dashboard';

class DashboardServices {
  getEstadisticas() {
    return axios.get(BASE_URL + '/estadisticas');
  }
}
export default new DashboardServices();