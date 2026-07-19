import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'pedido';
class PedidoServices {
  crearPedido(pedido) {
    return axios.post(BASE_URL, JSON.stringify(pedido));
  }
  getPedidosByUsuario(IdUsuario) {
    return axios.get(BASE_URL + '/getByUsuario/' + IdUsuario);
  }
}
export default new PedidoServices();