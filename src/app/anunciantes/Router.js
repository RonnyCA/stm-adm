import CrudLayout from '@/theme/CrudLayout.vue';
import FormView from './FormView.vue';
import TableView from './TableView.vue';
import DetailsView from './DetailsView.vue';

export default [
  {
    path: '/anunciantes',
    component: CrudLayout,
    children: [
      {
        path: '/',
        component: TableView,
        meta: {
          permission: 'Anunciante Listar',
        },
      },
      {
        path: ':anuncianteId/detalhes',
        component: DetailsView,
        meta: {
          permission: 'Anunciante Detalhes',
        },
      },
      {
        path: ':anuncianteId',
        component: FormView,
        meta: {
          permission: 'Anunciante Editar',
        },
      },
    ],
  },
];
