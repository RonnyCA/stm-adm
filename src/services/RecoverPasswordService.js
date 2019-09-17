import BaseService from './BaseService';

export default class RecoverPasswordService extends BaseService {
  constructor() {
    super('/RecuperarSenha');
  }

  recuperarSenha(params) {
    const url = this.getUrl();
    return this
      .$axios
      .patch(url, params);
  }

  alterarSenha(payload) {
    const url = this.getUrl('AlterarSenha');
    return this.$axios.post(url, payload);
  }

  verificaTokenValido(params) {
    const url = this.getUrl('VerificarToken');
    return this
      .$axios
      .post(url, params);
  }
}
