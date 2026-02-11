export const marketingArchitectureRoutes = [
  {
    path: '',
    loadComponent: () =>
      import('./architecture/architecture').then(
        (m) => m.MarketingArchitecture,
      ),
  },
];
