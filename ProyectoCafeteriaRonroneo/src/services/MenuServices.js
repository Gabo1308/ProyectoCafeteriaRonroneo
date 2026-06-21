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
  getProductosMenu(MenuId = null) {
    return MenuId ? axios.get(BASE_URL + '/getProductos/' + MenuId) : axios.get(BASE_URL + '/getProductos');
  }
  createMenu(Menu) {
    return axios.post(BASE_URL, JSON.stringify(Menu));
  }
  updateMenu(Menu) {
    return axios.put(BASE_URL, JSON.stringify(Menu));
  }
  deleteMenu(MenuId) {
    return axios.delete(BASE_URL + '/' + MenuId);
  }
}
export default new MenuServices();
