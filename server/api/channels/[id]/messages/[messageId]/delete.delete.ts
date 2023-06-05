import prisma from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
	if (!event.context.user.authenticated) {
		throw createError({
			statusCode: 401,
			statusMessage: 'You must be logged in to send a message.',
		});
	}

	const { id: channelId, messageId } = event.context.params;

	const message = await prisma.message.findFirst({
		where: {
			id: messageId,
			channelId: channelId,
		},
		include: {
			creator: true
		}
	});

	if (!message) {
		throw createError({
			statusCode: 404,
			statusMessage: `message in channel ${channelId} with id ${messageId} is not found.`,
		});
	}

	if (event.context.user.id !== message.creator.id) {
		throw createError({
			statusCode: 401,
			statusMessage: 'you are not allowed to delete that message.',
		});
	}

	await prisma.message.delete({
		where: {
			id: message.id
		}
	});

	global.io.emit(`message-${event.context.params?.id}`, { message: { id: message.id }, deleted: true });

	return {
		message: 'message successfully deleted.'
	};
});