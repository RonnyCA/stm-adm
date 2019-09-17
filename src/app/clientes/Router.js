import CrudLayout from '@/theme/CrudLayout.vue';
import TableView from './TableView.vue';
import DetailsView from './DetailsView.vue';

export default [
  {
    path: '/clientes',
    component: CrudLayout,
    children: [
      {
        path: '/',
        component: TableView,
        meta: {
          permission: 'Cliente Listar',
        },
      },
      {
        path: ':clienteId/detalhes',
        component: DetailsView,
        meta: {
          permission: 'Cliente Detalhes',
        },
      },
    ],
  },
];
