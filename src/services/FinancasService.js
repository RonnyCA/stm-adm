import BaseService from '@/services/BaseService';

export default class FinancaService extends BaseService {
  constructor() {
    super('/Financas');
  }

  find() {
    const url = this.getUrl();

    return this
      .$axios
      .get(url);
  }

  save(data) {
    const url = this.getUrl();

    return this
      .$axios
      .put(url, data);
  }
}
