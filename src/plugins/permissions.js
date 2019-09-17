import Vue from 'vue';
import UserService from '@/services/UserService';

const validate = (requestPermissions) => {
  if (Array.isArray(requestPermissions) && !requestPermissions.length) {
    return true;
  }

  const userModules = UserService.getPermittedModules();

  if (!userModules.length) {
    return false;
  }

  let hasPermission = true;

  const searchModules = requestPermissions || [];
  searchModules.forEach((permission) => {
    const filteredPermission = userModules.filter(module => module === permission);
    if (typeof permission !== 'undefined') {
      hasPermission = hasPermission && !!filteredPermission.length;
    }
  });

  return hasPermission;
};

Vue.use({
  install(vue) {
    const vueProtoype = vue.prototype;

    vueProtoype.$permissions = {
      validate,
    };
  },
});
