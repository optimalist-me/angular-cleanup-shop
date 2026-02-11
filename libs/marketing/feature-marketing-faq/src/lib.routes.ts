export const marketingFaqRoutes = [
  {
    path: '',
    loadComponent: () => import('./faq/faq').then((m) => m.MarketingFaq),
  },
];
