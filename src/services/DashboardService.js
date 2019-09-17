import ResourceService from './ResourceService';

export default class DashboardService extends  ResourceService {
  constructor() {
    super('/Dashboard');
  }

  getAdvertiser(params) {
    return this
      .$axios
      .get(this.getUrl('Anunciantes'), { params });
  }

  getAdvertiserActive(params) {
    return this
      .$axios
      .get(this.getUrl('Anunciantes/Ativos'), { params });
  }

  getCountClientsForChartActive(params) {
    const url = this.getUrl('Clientes/Ativos');

    return this
      .$axios
      .get(url, { params });
  }

  getCountClientsForChartHorizontalAgeRange(params) {
    const url = this.getUrl('Clientes/FaixaEtaria');

    return this
      .$axios
      .get(url, { params });
  }

  getCountClientsForIrregularPayment(params) {
    const url = this.getUrl('Clientes/Inadimplentes');

    return this
      .$axios
      .get(url, { params });
  }

  getAdvertiserReportPerPlan(params) {
    return this
      .$axios
      .get(this.getUrl('Anunciantes/Planos'), { params });
  }

  getAdvertiserType() {
    return this
      .$axios
      .get(this.getUrl('Anunciantes/Pendentes'));
  }

  getOffer(params) {
    return this
      .$axios
      .get(this.getUrl('Ofertas'), { params });
  }

  getOfferByPlan() {
    return this
      .$axios
      .get(this.getUrl('Ofertas/AprovacaoPendente'));
  }

  getOfferAdvertiserByPlan() {
    return this
      .$axios
      .get(this.getUrl('Reservas/AprovacaoPendente'));
  }

  getPaymentPendingSmart(params) {
    return this
      .$axios
      .get(this.getUrl('Smarts/PagamentoPendente'), { params });
  }

  /**Não pode ser nesse msm endpoint, tem que ser criado outro,
   * pois precisa de comissaoAcumulada e smart(quantidade ) a mais
   * nesse endpoint */
  getPaymentPendingCurrency(params) {
    return this
      .$axios
      .get(this.getUrl('Smarts/RecebimentoAcumuladoPendente'), { params });
  }

  getReceiveSmart(params) {
    return this
      .$axios
      .get(this.getUrl('Smarts/RecebimentoDeSmarts'), { params });
  }

  getPaymentSmart(params) {
    return this
      .$axios
      .get(this.getUrl('Smarts/PagamentoDeSmarts'), { params });
  }

  getCountClientsForChartRegistereds(params) {
    const url = this.getUrl('Clientes');

    return this
      .$axios
      .get(url, { params });
  }
}
