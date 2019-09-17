import CrudLayout from '@/theme/CrudLayout.vue';
import AdministradoresFormView from './FormView.vue';
import TableView from './TableView.vue';

export default [
  {
    path: '/administradores',
    component: CrudLayout,
    children: [
      {
        path: '/',
        component: TableView,
        meta: {
          permission: 'Administrador Listar',
        },
      },
      {
        path: 'cadastrar',
        component: AdministradoresFormView,
        meta: {
          permission: 'Administrador Detalhes',
        },
      },
      {
        path: ':administrador_id',
        component: AdministradoresFormView,
        meta: {
          permission: 'Administrador Editar',
        },
      },
    ],
  },
  {
    path: '/meu-perfil',
    component: CrudLayout,
    children: [
      {
        path: '/',
        component: AdministradoresFormView,
        meta: {
          permission: 'Administrador Detalhes',
        },
      },
    ],
  },
  {
    path: '/visualizar-perfil',
    component: CrudLayout,
    children: [
      {
        path: '/',
        component: AdministradoresFormView,
        meta: {
          permission: 'Administrador Detalhes',
        },
        props: {
          visualizar: true,
        },
      },
    ],
  },
];
