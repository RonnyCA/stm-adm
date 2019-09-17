import CrudLayout from '@/theme/CrudLayout.vue';
import ResgatesComponent from './TableView.vue';

export default [
  {
    path: '/resgates',
    component: CrudLayout,
    children: [
      {
        path: '/',
        component: ResgatesComponent,
        permission: 'Ofertas Listar',
      },
    ],
  },
];
