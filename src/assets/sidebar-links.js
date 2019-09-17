export default [
  {
    title: 'Home',
    link: '/',
    icon: 'home',
    permission: '',
  },
  {
    title: 'Administradores',
    link: '/administradores',
    icon: 'work',
    permission: 'Administrador Listar'
  },
  {
    title: 'Pessoas',
    icon: 'group',
    permission: '',
    children: [
      {
        title: 'Anunciantes',
        link: '/anunciantes',
        icon: 'person',
        permission: 'Anunciante Listar'
      },
      {
        title: 'Clientes',
        link: '/clientes',
        icon: 'person',
        permission: 'Cliente Listar'
      },
    ],
  },
  {
    title: 'Categorias',
    link: '/categorias',
    icon: 'dns',
    permission: 'Categoria Listar'
  },
  {
    title: 'Finanças',
    link: '/financas',
    icon: 'gavel',
    permission: 'Finanças Detalhes'
  },
  {
    title: 'Planos',
    link: '/planos',
    icon: 'supervised_user_circle',
    permission: 'Plano Listar',
  },
  {
    title: 'Ofertas',
    link: '/ofertas',
    icon: 'flare',
    permission: 'Ofertas Listar',
  },
  {
    title: 'Resgates',
    link: '/resgates',
    icon: 'attach_money',
    permission: 'Resgates Listar',
  },
  {
    title: 'Notificações',
    link: '/notificacoes',
    icon: 'notifications',
    permission: 'Notificacoes Enviar'
  },
  {
    title: 'Meu perfil',
    icon: 'account_circle',
    permission: '',
    children: [
      {
        title: 'Editar',
        link: '/meu-perfil',
        icon: 'edit',
        permission: 'Administrador Detalhes',
      },
      {
        title: 'Visualizar',
        link: '/visualizar-perfil',
        icon: 'visibility',
        permission: 'Administrador Detalhes',
      },
    ],
  },
  {
    title: 'Dashboards',
    icon: 'bar_chart',
    permission: '',
    children: [
      {
        title: 'Anunciantes',
        link: '/dashboard/anunciantes',
        icon: 'people',
        permission: 'Dashboard Anunciantes',
      },
      {
        title: 'Clientes',
        link: '/dashboard/clientes',
        icon: 'person',
        permission: 'Dashboard Clientes',
      },
      {
        title: 'Smarts',
        link: '/dashboard/smarts',
        icon: 'monetization_on',
        permission: 'Dashboard Smarts',
      },
      {
        title: 'Ofertas',
        link: '/dashboard/ofertas',
        icon: 'flare',
        permission: 'Dashboard Ofertas',
      },
    ],
  },
];
