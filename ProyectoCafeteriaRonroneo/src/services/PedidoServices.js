import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'pedido';

class PedidoServices {
  crearPedido(pedido) {
    return axios.post(BASE_URL, JSON.stringify(pedido));
  }
  getPedido(idPedido) {
    return axios.get(BASE_URL + '/get/' + idPedido);
  }
  getHistorialCliente(idUsuario, filtros = {}) {
    return axios.get(BASE_URL + '/getByCliente/' + idUsuario, { params: filtros });
  }
  getHistorialTodos(filtros = {}) {
    return axios.get(BASE_URL + '/getAll', { params: filtros });
  }
  getClientes() {
    return axios.get(BASE_URL + '/getClientes');
  }
  getClientePropio(idUsuario) {
    return axios.get(BASE_URL + '/getClientePropio/' + idUsuario);
  }

  getPorEstacion(idEstacion) {
    return axios.get(BASE_URL + '/getPorEstacion/' + idEstacion);
  }
  
  actualizarLinea(datos) {
    return axios.put(BASE_URL + '/actualizarLinea', JSON.stringify(datos));
  }
}

export default new PedidoServices();