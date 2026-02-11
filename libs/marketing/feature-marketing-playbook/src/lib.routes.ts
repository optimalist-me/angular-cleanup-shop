export const marketingPlaybookRoutes = [
  {
    path: '',
    loadComponent: () =>
      import('./playbook/playbook').then((m) => m.MarketingPlaybook),
  },
];
