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
  createProducto(Producto) {
    return axios.post(BASE_URL, JSON.stringify(Producto));
  }
  updateProducto(Producto) {
    return axios.put(BASE_URL, JSON.stringify(Producto));
  }
  deleteProducto(ProductoId) {
    return axios.delete(BASE_URL + '/' + ProductoId);
  }
  uploadImagenProducto(archivo) {
    const formData = new FormData();
    formData.append('imagen', archivo);
    return axios.post(BASE_URL + '/uploadImage', formData);
  }
}
export default new ProductosServices();
