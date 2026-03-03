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
              sourceTag: 'domain:checkout',
              onlyDependOnLibsWithTags: [
                'domain:checkout',
                'domain:orders',
                'domain:shared',
              ],
            },
            {
              sourceTag: 'domain:products',
              onlyDependOnLibsWithTags: ['domain:products', 'domain:shared'],
            },
            {
              sourceTag: 'domain:privacy',
              onlyDependOnLibsWithTags: ['domain:privacy', 'domain:shared'],
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
              sourceTag: 'domain:orders',
              onlyDependOnLibsWithTags: ['domain:orders', 'domain:shared'],
            },
            {
              sourceTag: 'domain:shared',
              onlyDependOnLibsWithTags: ['domain:shared'],
            },
          ],
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^(?!\\.{1,2}/)(?:.*\\/)?src(?:\\/|$)',
              message:
                "Do not import from another library's internal /src path via a non-relative import. Import from the library's public API (index.ts) or an explicit secondary entry point instead.",
            },
            {
              regex: '^(?!\\.{1,2}/)(?:.*\\/)?lib(?:\\/|$)',
              message:
                "Do not import from another library's internal /lib path via a non-relative import. Import from the library's public API (index.ts) or an explicit secondary entry point instead.",
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
