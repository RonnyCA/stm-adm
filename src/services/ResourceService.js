import BaseService from '@/services/BaseService';

export default class ResourceService extends BaseService {
  find(id) {
    const url = this.getUrl(id);

    return this
      .$axios
      .get(url);
  }

  findAll(options) {
    const url = this.getUrl();
    const paramsRequest = BaseService.mapGetParams(options);

    return this
      .$axios
      .get(url, paramsRequest);
  }

  add(postModel) {
    const url = this.getUrl();

    return this
      .$axios
      .post(url, postModel);
  }

  edit(id, postModel) {
    const url = this.getUrl(id);

    return this
      .$axios
      .put(url, postModel);
  }

  delete(id) {
    const url = this.getUrl(id);

    return this
      .$axios
      .delete(url);
  }
}
