import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'producto';
class ProductosServices {
  getProductos() {
    return axios.get(BASE_URL);
  }
  getProductoById(ProductoId) {
    return axios.get(BASE_URL + '/' + ProductoId);
  }
  getProductosByCategoria(CategoriaId) {
    return axios.get(BASE_URL + '/getByCategoria/' + CategoriaId);
  }
}
export default new ProductosServices();