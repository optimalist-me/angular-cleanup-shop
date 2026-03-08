import express from 'express';
import { enforceBookingRetentionPolicy } from '@angular-cleanup-shop/application-booking-service';
import { createBookingRouter } from '@angular-cleanup-shop/presentation-booking-rest';
import { setDatabase as setBookingDatabase } from '@angular-cleanup-shop/infrastructure-booking-datastore';
import { setDatabase as setProductsDatabase } from '@angular-cleanup-shop/infrastructure-products-datastore';
import { createProductsRouter } from '@angular-cleanup-shop/presentation-products-rest';
import { setDatabase as setOrdersDatabase } from '@angular-cleanup-shop/infrastructure-orders-datastore';
import { createOrdersRouter } from '@angular-cleanup-shop/presentation-orders-rest';
import { initializeDatabase } from './db/sqlite';

const RETENTION_INTERVAL_MS = 24 * 60 * 60 * 1000;

const app = express();

app.use(express.json());

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to api!' });
});

app.use('/api/bookings', createBookingRouter());
app.use('/api/products', createProductsRouter());
app.use('/api/orders', createOrdersRouter());

const port = process.env.PORT || 3333;

initializeDatabase()
  .then(async (db) => {
    setBookingDatabase(db);
    setProductsDatabase(db);
    setOrdersDatabase(db);

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

    const server = app.listen(port, () => {
      console.log(`Listening at http://localhost:${port}/api`);
    });
    server.on('error', console.error);
  })
  .catch((error) => {
    console.error('[API] Failed to initialize database', error);
    process.exit(1);
  });
