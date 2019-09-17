import BaseService from '@/services/BaseService';

const tokenKey = 'Authorization';
const userId = 'UserId';
const permission = 'Permissions'

const saveToken = token => localStorage.setItem(tokenKey, token);

const saveUserId = id => localStorage.setItem(userId, id);

const savePermissions = (data) => {
  const newPermissions = JSON.stringify(data.permission);
  localStorage.setItem(permission, newPermissions);
}

const removeAll = () => localStorage.clear();

export default class LoginService extends BaseService {
  constructor() {
    super('/Login');
  }

  static getToken() {
    return localStorage.getItem(tokenKey) || '';
  }

  static doLogout() {
    return removeAll();
  }

  static getUserId() {
    return localStorage.getItem(userId);
  }

  doLogin(login, password) {
    const loginModel = {
      login,
      senha: password,
    };

    const url = this.getUrl();
    return this
      .$axios
      .post(url, loginModel)
      .then((loginResponse) => {
        const {
          token,
          id,
          modulos
        } = loginResponse.data.item;
        saveUserId(id);
        saveToken(token);
        savePermissions({
          permission: modulos
        });
        return loginResponse;
      });
  }
}
