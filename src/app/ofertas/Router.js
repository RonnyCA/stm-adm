import CrudLayout from '@/theme/CrudLayout.vue';
import FormView from './FormView.vue';
import TableView from './TableView.vue';
import DetailsView from './DetailsView.vue';


export default [
  {
    path: '/ofertas',
    component: CrudLayout,
    children: [
      {
        path: '/',
        component: TableView,
        meta: {
          permission: 'Ofertas Listar',
        },
      },
      {
        path: ':ofertaId',
        component: FormView,
        meta: {
          permission: 'Ofertas Editar',
        },
      },
      {
        path: ':ofertaId/detalhes',
        component: DetailsView,
        meta: {
          permission: 'Ofertas Editar',
        },
      },
    ],
  },
];
