import prisma from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
	if (!event.context.user.authenticated) {
		throw createError({
			statusCode: 401,
			statusMessage: 'You must be logged in to view a user in a guild.',
		});
	}

	if (!event.context.params?.id) {
		throw createError({
			statusCode: 400,
			statusMessage: 'A userId is required',
		});
	}

	const { id: userId } = event.context.params;

	if (!userId) throw new Error('id missing on a dynamic route?');

	const user = await prisma.user.findFirst({
		where: {
			id: userId,
		},
		select: {
			id: true,
			username: true,
			createdAt: true,
		},
	});

	return user;
});