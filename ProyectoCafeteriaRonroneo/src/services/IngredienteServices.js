import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL + "ingrediente";

class IngredienteServices {
  getIngredientes() {
    return axios.get(BASE_URL);
  }
}

export default new IngredienteServices();
