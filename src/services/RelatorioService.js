import ResourceService from './ResourceService';

export default class RelatorioService extends  ResourceService {
  constructor() {
    super('/Relatorio');
  }

  getClientsForReportRegistered(params) {
    const url = this.getUrl('Clientes');

    return this
      .$axios
      .get(url, { params });
  }

  getAdvertiserReportPending(params) {
    return this
      .$axios
      .get(this.getUrl('Anunciantes/Pendentes'), { params });
  }

  getAdvertiserReport(params) {
    const url = this.getUrl('Anunciantes');

    return this
      .$axios
      .get(url, { params });
  }
  getAdvertiserReportActive(params) {
    const url = this.getUrl('Anunciantes/Ativos');

    return this
      .$axios
      .get(url, { params });
  }

  getClientsForReportIrregularPayment(params) {
    const url = this.getUrl('Clientes/Inadimplentes');

    return this
      .$axios
      .get(url, { params });
  }

  getClientsForReportRegisteredAndActive(params) {
    const url = this.getUrl('Clientes/Ativos');

    return this
      .$axios
      .get(url, { params });
  }

  getOfferReport(params) {
    return this
      .$axios
      .get(this.getUrl('Ofetas/AprovacaoPendente'), { params });
  }

  getReportPendingReserve(params) {
    return this
      .$axios
      .get(this.getUrl('Reservas/AprovacaoPendente'), { params });
  }

  getReportReceivePendingSmarts(params) {
    return this
      .$axios
      .get(this.getUrl('Smarts/RecebimentoPendente'), { params });
  }
  
  getReportReceiveSmarts(params) {
    return this
      .$axios
      .get(this.getUrl('Smarts/RecebimentoDeSmarts'), { params });
  }
  
  getReportPaymentSmarts(params) {
    
    return this
      .$axios
      .get(this.getUrl('Smarts/PagamentoDeSmarts'), { params });
  }

  getReportPaymentPendingSmarts(params) {
    
    return this
      .$axios
      .get(this.getUrl('Smarts/PagamentoPendente'), { params });
  }
}
