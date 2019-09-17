import Vue from 'vue';
import Router from 'vue-router';
import Layout from '@/theme/Layout.vue';
import Login from '@/app/login/LoginView.vue';
import LoginService from '@/services/LoginService';
import RecuperarSenha from '@/app/recuperarSenha/RecuperarSenhaView.vue';
import RedefinirSenha from '@/app/recuperarSenha/RedefinirSenhaView.vue';
import RoutesApp from './routes-app';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      component: Layout,
      children: RoutesApp,
    },
    {
      path: '/login',
      component: Login,
      name: 'Login',
    },
    {
      path: '/recuperar-senha',
      component: RecuperarSenha,
      name: 'RecuperarSenha',
    },
    {
      path: '/redefinir-senha',
      component: RedefinirSenha,
      name: 'RedefinirSenha',
    },
  ],
});

router.beforeEach((to, from, next) => {
  const token = LoginService.getToken();
  const { permission } = to.meta;
  const routeAuthorized = Vue
    .prototype
    .$permissions
    .validate([permission]);

  let nextRoute = next();

  if (!token && to.name !== 'Login' && to.name !== 'RecuperarSenha' && to.name !== 'RedefinirSenha') {
    nextRoute = next('/login');
  }

  if (token && to.name === 'Login') {
    nextRoute = next('/');
  }

  if (typeof permission !== 'undefined' && !routeAuthorized) {
    nextRoute = next('/');
  }

  return nextRoute;
});

export default router;
