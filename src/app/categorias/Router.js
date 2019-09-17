import CrudLayout from '@/theme/CrudLayout.vue';
import CategoriaComponent from './TableView.vue';
import CategoriaFormView from './FormView.vue';

export default [
  {
    path: '/categorias',
    component: CrudLayout,
    children: [
      {
        path: '/',
        component: CategoriaComponent,
        meta: {
          permission: 'Categoria Listar',
        },
      },
      {
        path: 'cadastrar',
        component: CategoriaFormView,
        meta: {
          permission: 'Categoria Inserir',
        },
      },
      {
        path: ':categoria_id',
        component: CategoriaFormView,
        meta: {
          permission: 'Categoria Editar',
        },
      },
    ],
  },
];
