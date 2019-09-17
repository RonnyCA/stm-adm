import CrudLayout from '@/theme/CrudLayout';
import ChartsClient from '@/app/dashboard/Client/ChartsClient';
import ChartsAdvertiser from './Advertiser/ChartsAdvertiser';
import ChartsOffer from './Offer/ChartsOffer';
import ChartsPayment from './Smarts/ChartsPayment';

export default [
  {
    path: '/dashboard',
    component: CrudLayout,
    permission: '',
    children: [
      {
        path: 'anunciantes',
        component: ChartsAdvertiser,
        permission: 'Dashboard Anunciantes',
      },
      {
        path: 'ofertas',
        component: ChartsOffer,
        permission: 'Dashboard Ofertas',
      },
      {
        path: 'clientes',
        component: ChartsClient,
        permission: 'Dashboard Clientes',
      },
      {
        path: 'smarts',
        component: ChartsPayment,
        permission: 'Dashboard Smarts',
      },
    ],
  },
];
