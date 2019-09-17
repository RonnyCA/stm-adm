import BaseService from './BaseService';

export default class UploadService extends BaseService {
  constructor() {
    super('/Upload');
  }

  uploadFile(file) {
    const url = this.getUrl();
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    const formData = new FormData();
    formData.append('arquivo', file);

    return this
      .$axios
      .post(url, formData, config);
  }
}
