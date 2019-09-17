import BaseService from './BaseService';

export default class NotificacaoService extends BaseService {
  constructor() {
    super('/Administrador/Notificacao');
  }

  getUsers(params) {
    const url = this.getUrl('/BuscarUsuarios');
    return this
      .$axios
      .get(url, { params });
  }

  enviarNotificacao(payload) {
    const url = this.getUrl('/EnviarNotificacao');
    return this
      .$axios
      .post(url, payload);
  }

  enviarNotificacaoAtraso(payload) {
    const url = this.getUrl('/EnviarNotificacaoAtraso');
    return this
      .$axios
      .post(url, payload);
  }
}
