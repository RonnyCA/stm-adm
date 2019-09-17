import axios from 'axios';

export default class CidadesService {
  static facade() {
    const { constructor } = this.prototype;
    return new constructor();
  }

  getCitiesByState(id) {
    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${id}/municipios`;
    return axios.get(url);
  }
}
