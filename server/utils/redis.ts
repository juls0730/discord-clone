import Redis from 'ioredis';
const redis = new Redis({
	host: 'redis'
});

export default redis;