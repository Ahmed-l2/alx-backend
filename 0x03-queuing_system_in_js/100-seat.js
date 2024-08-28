import { createClient } from 'redis';
import { promisify } from 'util';
import kue from 'kue';
import express from 'express';
import { join } from 'path';

const app = express();

const client = createClient();
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err.message}`);
});

let reservationEnabled = true;
reserveSeat(50);
const queue = kue.createQueue();

async function reserveSeat(number) {
  return setAsync('available_seats', number);
}

async function getCurrentAvailableSeats() {
  return getAsync('available_seats');
}


app.get('/available_seats', async (req, res) => {
  const availableSeats = await getCurrentAvailableSeats();
  res.send({numberOfAvailableSeats: availableSeats });
});

app.get('/reserve_seat', (req, res) => {
  if (reservationEnabled) {
    const job = queue.create('reserve_seat', {
      title: 'Reserve seat',
      number: 1
    });

    job.on('complete', () => {
      console.log(`Seat reservation job ${job.id} completed`);
    }).on('failed', (err) => {
      console.log(`Seat reservation job ${job.id} failed: ${err}`);
    });

    job.save((err) => {
      if (err) {
        console.error(`Job save failed: ${err}`);
        res.send({ status: 'Reservation failed' });
      } else {
        res.send({ status: 'Reservation in process' });
      }
    });

  } else {
    res.send({ "status": "Reservations are blocked" });
  }
});


app.get('/process', (req, res) => {
  res.send({status: 'Queue processing'}).end();
  queue.process('reserve_seat', async (job, done) => {
    const availableSeats = await getCurrentAvailableSeats();
    if (availableSeats === 0) {
      reservationEnabled = false;
      done();
    } else if (availableSeats > 0) {
      reserveSeat(availableSeats - 1);
      done();
    } else {
      done(new Error('Not enough seats available'));
    }
  });
});

app.listen(1245, () => {
    console.log(`Server is running on http://localhost:${1245}`);
});
