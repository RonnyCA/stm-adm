import ResourceService from './ResourceService';

export default class CategoriaService extends ResourceService {
  constructor() {
    super('/Categoria');
  }

  findAllWithoutPaginate() {
    const url = this.getUrl('GetAll');

    return this
      .$axios
      .get(url);
  }
}
