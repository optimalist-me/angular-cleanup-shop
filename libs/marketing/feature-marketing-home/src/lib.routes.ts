export const marketingHomeRoutes = [
  {
    path: '',
    loadComponent: () => import('./home/home').then((m) => m.MarketingHome),
  },
];
