export default [
  {
    path: '/relatorios',
    component: () => import('@/theme/CrudLayout'),
    children: [
      {
        path: 'clientes-cadastrados',
        name: 'report-clients-registered',
        component: () => import('@/app/relatorio/Clients/ReportClientsRegistered'),
      },
      {
        path: 'anunciantes-cadastrados-ativos',
        name: 'report-advertiser-active',
        component: () => import('@/app/relatorio/Advertiser/ReportAdvertiserActive.vue'),
      },
      {
        path: 'anunciantes-cadastrados-registrados',
        name: 'report-advertiser-registered',
        component: () => import('@/app/relatorio/Advertiser/ReportAdvertiserRegistered.vue'),
      },
      {
        path: 'anunciantes-ativo-plano',
        name: 'report-advertiser-registered-per-plan',
        component: () => import('@/app/relatorio/Advertiser/ReportAdvertiserRegisteredPerPlan.vue'),
      },
      {
        path: 'anunciantes-pendentes-aprovacao',
        name: 'report-advertiser-pending-approval',
        component: () => import('@/app/relatorio/Advertiser/ReportAdvertiserPendingApproval.vue'),
      },
      {
        path: 'anunciantes-com-pagamentos-irregular',
        name: 'report-advertiser-irregular-payment',
        component: () => import('@/app/relatorio/Advertiser/ReportAdvertiserIrregularPayment.vue'),
      },
      {
        path: 'clientes-irregulares',
        name: 'report-clients-irregular-payment',
        component: () => import('@/app/relatorio/Clients/ReportClientsIrregularPayment.vue'),
      },
      {
        path: 'ofertas-pendentes-aprovacao',
        name: 'report-offer-pending-approval-per-plan',
        component: () => import('@/app/relatorio/Offers/ReportOfferPendingApprovalPerPlan.vue'),
      },
      {
        path: 'reservas-pendentes-aprovacao-por-plano',
        name: 'report-reservations-pending-approval-per-plan',
        component: () => import('@/app/relatorio/Offers/ReportReservePendingApprovalPerPlan.vue'),
      },
      {
        path: 'pendente-de-pagamento-smarts-por-plano',
        name: 'report-payment-pending-by-plan',
        component: () => import('@/app/relatorio/Smarts/ReportPaymentPendingByPlan.vue'),
      },
      {
        path: 'pendente-de-recebimento-smarts-por-plano',
        name: 'report-receive-pending-currency-by-plan',
        component: () => import('@/app/relatorio/Smarts/ReportReceivePendingCurrencyByPlan.vue'),
      },
      {
        path: 'recebimento-de-smarts',
        name: 'report-receive-smart',
        component: () => import('@/app/relatorio/Smarts/ReportReceiveSmart.vue'),
      },
      {
        path: 'pagamento-de-smarts',
        name: 'report-payment-smart',
        component: () => import('@/app/relatorio/Smarts/ReportPaymentSmart.vue'),
      },
      {
        path: 'clientes-ativos',
        name: 'report-clients-registered-and-active',
        component: () => import('@/app/relatorio/Clients/ReportClientsRegisteredAndActive'),
      },
    ],
  },
];
