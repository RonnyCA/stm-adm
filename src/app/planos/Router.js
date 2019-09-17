import CrudLayout from '@/theme/CrudLayout.vue';
import PlanosComponent from './TableView.vue';
import PlanosFormView from './FormView.vue';

export default [
  {
    path: '/planos',
    component: CrudLayout,
    children: [
      {
        path: '/',
        component: PlanosComponent,
        meta: {
          permission: 'Plano Listar',
        },
      },
      {
        path: 'cadastrar',
        component: PlanosFormView,
        meta: {
          permission: 'Plano Inserir',
        },
      },
      {
        path: ':plano_id',
        component: PlanosFormView,
        meta: {
          permission: 'Plano Editar',
        },
      },
    ],
  },
];
