import CrudLayout from '@/theme/CrudLayout.vue';
import NoticacaoComponent from './FormView.vue';

export default [
  {
    path: '/notificacoes',
    component: CrudLayout,
    children: [
      {
        path: '/',
        component: NoticacaoComponent,
        permission: 'Notificacoes Enviar',
      },
    ],
  },
];
