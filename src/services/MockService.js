import BaseService from './BaseService';

export default class Mock extends BaseService {
  getUrl(id) {
    const idCopy = id || '';
    return `https://5be45c4b95e4340013f88f57.mockapi.io/api/v1${this.apiUrl}/${idCopy}`;
  }
}
