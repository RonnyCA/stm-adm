import ResourceService from './ResourceService';

export default class PlanosService extends ResourceService {
  constructor() {
    super('/Planos');
  }

  upload(data) {
    const url = '/api/upload';
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    return this
      .$axios
      .patch(url, data, config);
  }

  getPlans() {
    return this
      .$axios
      .get(this.getUrl('GetAll'));
  }
}
