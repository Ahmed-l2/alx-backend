import { createClient } from 'redis';

const subClient = createClient();

subClient.on('connect', () => {
  console.log('Redis client connected to the server');
});

subClient.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err.message}`);
});

subClient.subscribe('holberton school channel');

subClient.on('message', (channel, message) => {
  if (message === 'KILL_SERVER') {
    subClient.unsubscribe('holberton school channel');
    subClient.quit();
  } else {
    console.log(message);
  }
});
