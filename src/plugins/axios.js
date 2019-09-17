import Vue from 'vue';
import axios from 'axios';
import ChangeCaseObject from 'change-case-object';
import LoginService from '@/services/LoginService';

const token = LoginService.getToken();

const config = {
  headers: {
    AuthorizationToken: token,
  },
};

const axiosInstance = axios.create(config);

const convertRequest = (requestObject) => {
  const contentType = requestObject.headers['Content-Type'];
  const objectData = requestObject.data;
  const objectParam = requestObject.params;
  const privateResponseObject = requestObject;

  if (contentType !== 'multipart/form-data') {
    privateResponseObject.data = ChangeCaseObject.camelCase(objectData);
  }

  if (requestObject.url.includes('mockapi')) {
    requestObject.headers = {};
  }

  privateResponseObject.params = ChangeCaseObject.camelCase(objectParam);

  return privateResponseObject;
};

const convertRequestError = (responseObject) => {
  const response = convertRequest(responseObject.response);
  return Promise.reject(response);
};

const convertResponse = (responseObject) => {
  const objectData = responseObject.data;
  const privateResponseObject = responseObject;

  privateResponseObject.data = ChangeCaseObject.snakeCase(objectData);

  return responseObject;
};

const convertResponseError = (responseObject) => {
  const response = convertResponse(responseObject.response);
  return Promise.reject(response);
};

const tokenIsValid = (responseObject) => {
  if (responseObject.data.message === 'Your session has been terminated') {
    localStorage.clear();
    location.replace('/login');
  }
  return Promise.reject(responseObject);
};

// ---------- //

axiosInstance.interceptors.request.use(
  requestConfig => convertRequest(requestConfig),
  error => convertRequestError(error),
);

axiosInstance.interceptors.response.use(
  response => convertResponse(response),
  error => convertResponseError(error),
);

axiosInstance.interceptors.response.use(
  response => response,
  error => tokenIsValid(error),
);

Plugin.install = (VueInstance) => {
  const privateVueInstance = VueInstance;
  privateVueInstance.axios = axiosInstance;
  window.axios = axiosInstance;

  Object.defineProperties(VueInstance.prototype, {
    axios: {
      get() {
        return axiosInstance;
      },
    },
    $axios: {
      get() {
        return axiosInstance;
      },
    },
  });
};

Vue.use(Plugin);

export default Plugin;
