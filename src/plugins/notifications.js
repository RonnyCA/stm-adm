import Vue from 'vue';
import VueNotification from 'vue-notifications';
import miniToastr from 'mini-toastr';

const toastTypes = {
  success: 'success',
  error: 'error',
  info: 'info',
  warn: 'warn',
};

const toast = (parameters) => {
  const {
    title,
    message,
    type,
    timeout,
    cb,
    consoleMessage,
  } = parameters;

  if (consoleMessage) {
    console[type](consoleMessage);
  }
  return miniToastr[type](message, title, timeout, cb);
};

const options = {
  success: toast,
  error: toast,
  info: toast,
  warn: toast,
};

miniToastr.init({ types: toastTypes });
VueNotification.config.timeout = 5000;
Vue.use(VueNotification, options);
