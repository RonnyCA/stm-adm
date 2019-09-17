import ResourceService from './ResourceService';
import BaseService from './BaseService';

export default class AvaliacaoOfertasService extends ResourceService {
  constructor() {
    super('/AvaliacaoPublicacao');
  }

  alterarStatus(avaliacaoId, novoStatus) {
    const url = this.getUrl(avaliacaoId);
    const data = {
      status: novoStatus,
    };

    return this
      .$axios
      .patch(url, data);
  }

  getAvaliations(query) {
    const params = BaseService.mapGetParams(query);

    return this
      .$axios
      .get(this.getUrl(), params);
  }
}
