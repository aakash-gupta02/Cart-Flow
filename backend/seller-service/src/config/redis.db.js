import { createClient } from 'redis';
import { config } from './config.js';

const client = createClient({
    username: 'default',
    password: config.redisPassword,
    socket: {
        host: config.redisHost,
        port: config.redisPort
    }
});

client.on('error', err => console.log('Redis Client Error', err));
client.on('connect', () => console.log('Redis Client Connected'));

await client.connect();

export default client;

await client.set('foo', 'bar');
const result = await client.get('foo');
console.log(result)  // >>> bar

