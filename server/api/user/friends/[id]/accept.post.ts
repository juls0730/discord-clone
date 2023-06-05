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

	if (!request?.id) {
		throw createError({
			statusCode: 404,
			statusMessage: 'friend request not found.'
		});
	}

	if (request?.recipientId !== event.context.user.id) {
		throw createError({
			statusCode: 403,
			statusMessage: 'You do not have permission to accept this friend request.'
		});
	}

	await prisma.user.update({
		where: {
			id: event.context.user.id
		},
		data: {
			friends: {
				connect: [{ id: request.senderId }]
			}
		}
	});

	await prisma.user.update({
		where: {
			id: request.senderId
		},
		data: {
			friends: {
				connect: [{ id: event.context.user.id }]
			}
		}
	});

	await prisma.friendRequest.update({
		where: {
			id: requestId
		},
		data: {
			status: 'accepted'
		}
	});

	return {
		message: 'friend request accepted successfully.'
	};
});