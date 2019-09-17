import BaseService from './BaseService';
import ResourceService from './ResourceService';

export default class OfertasService extends ResourceService {
  constructor() {
    super('/Publicacao');
  }

  getOffers(query) {
    const params = BaseService.mapGetParams(query);

    return this
      .$axios
      .get(this.getUrl(), params);
  }

  upload(data) {
    const url = 'api/upload';
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    return this
      .$axios
      .patch(url, data, config);
  }
}
