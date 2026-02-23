/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import { existsSync } from 'node:fs';
import * as path from 'path';
import { pathToFileURL } from 'node:url';
import { enforceBookingRetentionPolicy } from '@angular-cleanup-shop/application-booking-service';
import { createBookingRouter } from '@angular-cleanup-shop/presentation-booking-rest';
import { setDatabase } from '@angular-cleanup-shop/infrastructure-booking-datastore';
import { initializeDatabase } from './db/sqlite';

type NodeRequestHandlerFunction = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void> | void;

const importEsmModule = new Function(
  'modulePath',
  'return import(modulePath);',
) as (modulePath: string) => Promise<{ reqHandler?: unknown }>;

const assetsPath = path.join(__dirname, 'assets');
const shopBrowserPath = path.join(__dirname, '../shop/browser');
const shopServerBundlePath = path.join(__dirname, '../shop/server/server.mjs');
const RETENTION_INTERVAL_MS = 24 * 60 * 60 * 1000;

const app = express();

// Middleware
app.use(express.json());

app.use(express.static(assetsPath));
app.use(
  express.static(shopBrowserPath, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

// Health check
app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to api!' });
});

// Booking routes
app.use('/api/bookings', createBookingRouter());

async function loadShopSsrHandler(): Promise<NodeRequestHandlerFunction | null> {
  if (!existsSync(shopServerBundlePath)) {
    console.warn(
      `[API] SSR bundle not found at ${shopServerBundlePath}. Falling back to browser index.`,
    );
    return null;
  }

  try {
    const moduleUrl = pathToFileURL(shopServerBundlePath).href;
    const shopServer = await importEsmModule(moduleUrl);
    const reqHandler = shopServer.reqHandler;

    if (typeof reqHandler !== 'function') {
      console.warn(
        '[API] SSR bundle does not export reqHandler. Falling back to browser index.',
      );
      return null;
    }

    console.log(`[API] Loaded shop SSR handler from ${shopServerBundlePath}`);
    return reqHandler as NodeRequestHandlerFunction;
  } catch (error) {
    console.error(
      '[API] Failed to load SSR bundle. Falling back to SPA mode.',
      error,
    );
    return null;
  }
}

function configureFrontendRouting(
  frontendRequestHandler: NodeRequestHandlerFunction | null,
): void {
  if (frontendRequestHandler) {
    app.use('/**', (req, res, next) => frontendRequestHandler(req, res, next));
    return;
  }

  app.get('*', (req, res) => {
    const indexPath = path.join(shopBrowserPath, 'index.html');

    if (!existsSync(indexPath)) {
      res
        .status(503)
        .send(
          'Frontend build not found. Run `yarn nx build shop` (or a command that builds shop) before starting the API server.',
        );
      return;
    }

    res.sendFile(indexPath);
  });
}

const port = process.env.PORT || 3333;

initializeDatabase()
  .then(async (db) => {
    setDatabase(db);

    const runRetentionPolicy = async (source: string) => {
      try {
        const deletedCount = await enforceBookingRetentionPolicy();
        console.log(
          `[API] Booking retention cleanup (${source}) deleted ${deletedCount} record(s).`,
        );
      } catch (error) {
        console.error(
          `[API] Booking retention cleanup failed (${source}).`,
          error,
        );
      }
    };

    await runRetentionPolicy('startup');
    setInterval(() => {
      void runRetentionPolicy('interval');
    }, RETENTION_INTERVAL_MS).unref();

    const frontendRequestHandler = await loadShopSsrHandler();
    configureFrontendRouting(frontendRequestHandler);

    const server = app.listen(port, () => {
      console.log(`Listening at http://localhost:${port}/api`);
    });
    server.on('error', console.error);
  })
  .catch((error) => {
    console.error('[API] Failed to initialize booking database', error);
    process.exit(1);
  });
