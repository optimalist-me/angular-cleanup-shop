#!/usr/bin/env node

import { readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';

const ROOTS_TO_SCAN = ['apps', 'libs'];
const IGNORED_DIRECTORIES = new Set([
  'node_modules',
  'dist',
  'coverage',
  '.nx',
  'tmp',
  '.angular',
]);
const ALLOWED_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.html',
  '.json',
]);
const TEST_FILE_PATTERNS = [/\.spec\.[jt]sx?$/u, /\.test\.[jt]sx?$/u];

const TRACKING_DETECTORS = [
  { name: 'Google Analytics URL', pattern: /google-analytics\.com/iu },
  { name: 'Google Tag Manager URL', pattern: /googletagmanager\.com/iu },
  { name: 'Google DoubleClick URL', pattern: /doubleclick\.net/iu },
  { name: 'Facebook tracking URL', pattern: /connect\.facebook\.net/iu },
  { name: 'Segment URL', pattern: /api\.segment\.io|segment\.com\/analytics\.js/iu },
  { name: 'Plausible URL', pattern: /plausible\.io/iu },
  { name: 'PostHog URL', pattern: /posthog\.com/iu },
  { name: 'Mixpanel URL', pattern: /mixpanel\.com/iu },
  { name: 'gtag invocation', pattern: /(^|[^a-zA-Z0-9_$])gtag\s*\(/u },
  { name: 'fbq invocation', pattern: /(^|[^a-zA-Z0-9_$])fbq\s*\(/u },
  { name: 'dataLayer push', pattern: /dataLayer\.push\s*\(/u },
  { name: 'Plausible invocation', pattern: /(^|[^a-zA-Z0-9_$])plausible\s*\(/u },
  { name: 'Segment analytics.track', pattern: /analytics\.track\s*\(/u },
  { name: 'Google Analytics G-* ID', pattern: /\bG-[A-Z0-9]{6,}\b/u },
  { name: 'Google Analytics UA-* ID', pattern: /\bUA-\d+-\d+\b/u },
];

const BANNED_DEPENDENCIES = new Set([
  '@segment/analytics-next',
  '@segment/analytics-node',
  '@vercel/analytics',
  'analytics',
  'analytics-node',
  'mixpanel',
  'mixpanel-browser',
  'plausible-tracker',
  'posthog-js',
  'react-ga',
  'react-ga4',
  'vue-gtag',
]);

function isTestFile(path) {
  return TEST_FILE_PATTERNS.some((pattern) => pattern.test(path));
}

function shouldScanFile(path) {
  return ALLOWED_EXTENSIONS.has(extname(path)) && !isTestFile(path);
}

function walkFiles(root) {
  const files = [];

  function walk(currentPath) {
    const entries = readdirSync(currentPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (IGNORED_DIRECTORIES.has(entry.name)) {
          continue;
        }
        walk(join(currentPath, entry.name));
        continue;
      }

      const fullPath = join(currentPath, entry.name);
      if (shouldScanFile(fullPath)) {
        files.push(fullPath);
      }
    }
  }

  walk(root);
  return files;
}

function lineNumberForIndex(text, index) {
  if (index <= 0) {
    return 1;
  }
  return text.slice(0, index).split('\n').length;
}

function loadPackageDependencies() {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
  return {
    ...(packageJson.dependencies ?? {}),
    ...(packageJson.devDependencies ?? {}),
  };
}

function main() {
  const findings = [];

  for (const root of ROOTS_TO_SCAN) {
    const files = walkFiles(root);
    for (const file of files) {
      const content = readFileSync(file, 'utf8');
      for (const detector of TRACKING_DETECTORS) {
        const match = detector.pattern.exec(content);
        if (!match || match.index === undefined) {
          continue;
        }

        const lineNumber = lineNumberForIndex(content, match.index);
        const lineText = content.split('\n')[lineNumber - 1]?.trim() ?? '';
        findings.push({
          type: detector.name,
          file,
          lineNumber,
          lineText,
        });
      }
    }
  }

  const dependencies = loadPackageDependencies();
  const blockedPackages = Object.keys(dependencies)
    .filter((pkgName) => BANNED_DEPENDENCIES.has(pkgName))
    .sort();

  if (blockedPackages.length === 0 && findings.length === 0) {
    console.log(
      'Compliance check passed: no non-essential analytics dependencies or tracker signatures found.',
    );
    return;
  }

  console.error('Compliance check failed.');

  if (blockedPackages.length > 0) {
    console.error('\nBlocked analytics dependencies found:');
    for (const pkgName of blockedPackages) {
      console.error(`- ${pkgName}`);
    }
  }

  if (findings.length > 0) {
    console.error('\nTracker signatures found in source files:');
    for (const finding of findings) {
      console.error(
        `- ${finding.type}: ${finding.file}:${finding.lineNumber} -> ${finding.lineText}`,
      );
    }
  }

  process.exitCode = 1;
}

main();
