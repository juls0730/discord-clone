import prisma from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
	if (!event.context.user.authenticated) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Unauthenticated',
		});
	}

	const requestId = event.context.params?.id;

	if (!requestId) return;

	const request = await prisma.friendRequest.findFirst({
		where: {
			id: requestId
		}
	});

	if (request?.senderId !== event.context.user.id && request?.recipientId !== event.context.user.id) {
		throw createError({
			statusCode: 403,
			statusMessage: 'You do not have permission to cancel this friend request.'
		});
	}

	await prisma.friendRequest.delete({
		where: {
			id: requestId
		}
	});

	return {
		message: 'successfully cancelled this friend request.'
	};
});