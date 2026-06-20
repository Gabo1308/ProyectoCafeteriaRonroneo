import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'menu';
class MenuServices {
  getMenus() {
    return axios.get(BASE_URL);
  }
  getMenuById(MenuId) {
    return axios.get(BASE_URL + '/' + MenuId);
  }
  getMenuDisponible() {
    return axios.get(BASE_URL + '/getDisponible');
  }
  getCombosByMenu(MenuId) {
    return axios.get(BASE_URL + '/getCombos/' + MenuId);
  }
  getProductosMenu() {
    return axios.get(BASE_URL + '/getProductos');
  }
}
export default new MenuServices();
