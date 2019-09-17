import CrudLayout from '@/theme/CrudLayout.vue';
import FinancasFormView from './FormView.vue';

export default [
  {
    path: '/financas',
    component: CrudLayout,
    children: [
      {
        path: '/',
        component: FinancasFormView,
        meta: {
          permission: 'Finanças Detalhes',
        },
      },
    ],
  },
];
