import redis from '~/server/utils/redis';

const INCREMENT_LIMIT = 5;
const LIMIT_TIME = 700; // milliseconds

export default defineEventHandler(async (event) => {
	if (event.node.req.method === 'HEAD' || event.node.req.method === 'OPTIONS' || event.node.req.method === 'GET') return;
	const cookies = parseCookies(event);

	// if there is no session token in the cookie the request doesn't need a cookie or they just don't have a session token and it will error appropriately.
	if (!cookies.sessionToken) return;

	const date = new Date().getTime();
	const lastRequestData = await redis.get(`request-${cookies.sessionToken}`);
	redis.set(`request-${cookies.sessionToken}`, `${new Date().getTime()} ${(parseInt(lastRequestData?.split(' ')[1] || '0') + 1)}`);
	if (!lastRequestData) return;
	const [lastRequestDate, increment] = lastRequestData.split(' ');

	if (lastRequestDate && +lastRequestDate + LIMIT_TIME >= date) {
		if (increment && +increment < INCREMENT_LIMIT) return;
		throw createError({
			statusCode: 429,
		});
	} else {
		redis.set(`request-${cookies.sessionToken}`, `${new Date().getTime()} 0`);
	}
});