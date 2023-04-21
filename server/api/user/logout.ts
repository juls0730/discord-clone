import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const { sessionToken } = parseCookies(event);

	if (!sessionToken) {
		throw createError({
			statusCode: 400,
			statusMessage: 'A session token is required to logout duh',
		});
	}

	await prisma.session.delete({
		where: {
			token: sessionToken
		},
	});

	return {
		message: 'successfully logged out'
	};
});