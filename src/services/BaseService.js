import Vue from 'vue';

export default class Service {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.$axios = Vue.axios;
  }

  static defaultGetOptions = {
    pagina_atual: 1,
    quantidade_por_pagina: 10,
  };

  static mapGetParams(params) {
    const paramsCopy = params || {};
    const paramsRequest = {
      params: { ...Service.defaultGetOptions },
    };

    Object
      .entries(paramsCopy)
      .forEach((item) => {
        const [key, value] = item;
        const type = typeof value;

        if (value || type === 'boolean') {
          paramsRequest.params[key] = value;
        }
      });

    return paramsRequest;
  }

  static facade() {
    const { constructor } = this.prototype;
    return new constructor();
  }

  getUrl(id) {
    const idCopy = id || '';
    return `/api/v1${this.apiUrl}/${idCopy}`;
  }
}
