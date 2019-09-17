import axios from 'axios';

export default class EstadosService {
  static facade() {
    const { constructor } = this.prototype;
    return new constructor();
  }

  getAll() {
    const url = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';
    return axios.get(url);
  }
}
