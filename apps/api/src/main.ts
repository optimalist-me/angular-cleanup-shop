/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import { createBookingRouter } from '@angular-cleanup-shop/presentation-booking-rest';
import { setDatabase } from '@angular-cleanup-shop/infrastructure-booking-datastore';
import { initializeDatabase } from './db/sqlite';

const app = express();

// Middleware
app.use(express.json());

app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, '../shop/browser')));

// Health check
app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to api!' });
});

// Booking routes
app.use('/api/bookings', createBookingRouter());

// For Angular client-side routing: serve index.html for all unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../shop/browser/index.html'));
});

const port = process.env.PORT || 3333;

initializeDatabase()
  .then((db) => {
    setDatabase(db);
    const server = app.listen(port, () => {
      console.log(`Listening at http://localhost:${port}/api`);
    });
    server.on('error', console.error);
  })
  .catch((error) => {
    console.error('[API] Failed to initialize booking database', error);
    process.exit(1);
  });
