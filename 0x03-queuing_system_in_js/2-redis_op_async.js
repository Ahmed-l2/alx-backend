import { print, createClient } from 'redis';
import { promisify } from "util";

const client = createClient();
const getAsync = promisify(client.get).bind(client);

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err.message}`);
});

function setNewSchool(schoolName, value) {
  client.set(schoolName, value, print);
}

async function displaySchoolValue(schoolName) {
  try {
		console.log(await getAsync(schoolName));
	} catch (err) {
		console.error(`Error getting ${schoolName}: ${err.message}`)
	}
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
