export const productDetailRoutes = [
  {
    path: '',
    loadComponent: () => import('./detail/detail').then((m) => m.ProductDetail),
  },
];
