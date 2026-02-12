export const productsListRoutes = [
  {
    path: '',
    loadComponent: () => import('./list/list').then((m) => m.ProductsList),
  },
];
