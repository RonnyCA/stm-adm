import ResourceService from './ResourceService';

export default class ResgateService extends ResourceService {
  constructor() {
    super('/PagamentoDeSmarts');
  }

  pagarSolicitacaoDeSaque(payload) {
    return this
      .$axios
      .patch(this.getUrl(), payload);
  }
}
