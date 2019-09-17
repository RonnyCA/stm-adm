import BaseService from './BaseService';

export default class UserService extends BaseService {
  constructor() {
    super('/Usuario');
  }

  static getPermittedModules() {
    const permissions = localStorage.getItem('Permissions');
    if (permissions) {
      return JSON.parse(permissions);
    }
    return [];
  }

  findAnunciantes(options) {
    const url = this.getUrl('Anunciantes');
    const paramsRequest = BaseService.mapGetParams(options);

    return this
      .$axios
      .get(url, paramsRequest);
  }

  findClientes(options) {
    const url = this.getUrl('Clientes');
    const paramsRequest = BaseService.mapGetParams(options);

    return this
      .$axios
      .get(url, paramsRequest);
  }

  find(id) {
    const url = this.getUrl(id);

    return this
      .$axios
      .get(url);
  }

  edit(id, model) {
    const url = this.getUrl(id);

    return this
      .$axios
      .put(url, model);
  }

  enable(id) {
    const url = this.getUrl(`${id}/Ativar`);

    return this
      .$axios
      .patch(url);
  }

  disable(id) {
    const url = this.getUrl(`${id}/Inativar`);

    return this
      .$axios
      .patch(url);
  }

  aprovarOuReprovarUsuario(params) {
    const url = this.getUrl('Aprovar');

    return this
      .$axios
      .patch(url, params);
  }
}
