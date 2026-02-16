import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/out-tsc'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: 'scope:app',
              onlyDependOnLibsWithTags: [
                'type:feature',
                'type:data-access',
                'type:ui',
                'type:util',
                'type:models',
                'domain:shared',
              ],
            },
            {
              sourceTag: 'scope:backend',
              onlyDependOnLibsWithTags: [
                'type:presentation',
                'type:application',
                'type:infrastructure',
                'type:util',
                'type:models',
                'domain:shared',
              ],
            },
            {
              sourceTag: 'type:e2e',
              onlyDependOnLibsWithTags: ['scope:app'],
            },
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: [
                'type:data-access',
                'type:ui',
                'type:util',
                'type:models',
                'domain:shared',
              ],
            },
            {
              sourceTag: 'type:data-access',
              onlyDependOnLibsWithTags: [
                'type:util',
                'type:models',
                'domain:shared',
              ],
            },
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: [
                'type:ui',
                'type:util',
                'type:models',
                'domain:shared',
              ],
            },
            {
              sourceTag: 'type:util',
              onlyDependOnLibsWithTags: [
                'type:util',
                'type:models',
                'domain:shared',
              ],
            },
            {
              sourceTag: 'type:models',
              onlyDependOnLibsWithTags: ['type:models', 'domain:shared'],
            },
            {
              sourceTag: 'type:api',
              onlyDependOnLibsWithTags: [
                'type:presentation',
                'type:application',
                'type:infrastructure',
                'type:util',
                'type:models',
                'domain:shared',
              ],
            },
            {
              sourceTag: 'type:presentation',
              onlyDependOnLibsWithTags: [
                'type:application',
                'type:util',
                'type:models',
                'domain:shared',
              ],
            },
            {
              sourceTag: 'type:application',
              onlyDependOnLibsWithTags: [
                'type:infrastructure',
                'type:util',
                'type:models',
                'domain:shared',
              ],
            },
            {
              sourceTag: 'type:infrastructure',
              onlyDependOnLibsWithTags: [
                'type:util',
                'type:models',
                'domain:shared',
              ],
            },
            {
              sourceTag: 'domain:marketing',
              onlyDependOnLibsWithTags: ['domain:marketing', 'domain:shared'],
            },
            {
              sourceTag: 'domain:services',
              onlyDependOnLibsWithTags: ['domain:services', 'domain:shared'],
            },
            {
              sourceTag: 'domain:catalog',
              onlyDependOnLibsWithTags: ['domain:catalog', 'domain:shared'],
            },
            {
              sourceTag: 'domain:cart',
              onlyDependOnLibsWithTags: ['domain:cart', 'domain:shared'],
            },
            {
              sourceTag: 'domain:booking',
              onlyDependOnLibsWithTags: ['domain:booking', 'domain:shared'],
            },
            {
              sourceTag: 'domain:shared',
              onlyDependOnLibsWithTags: ['domain:shared'],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
];
