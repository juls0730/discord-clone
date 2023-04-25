import emojiRegex from 'emoji-regex';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	if (!event.context.user.authenticated) {
		throw createError({
			statusCode: 401,
			statusMessage: 'You must be logged in to send a message.',
		});
	}

	if (!event.context.params?.name) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Reaction must be defined.',
		});
	}

	const emoji = decodeURIComponent(event.context.params.name);
	const match = emoji.match(emojiRegex());
	if (!match || match.length !== 1) {
		throw createError({
			statusCode: 400,
			statusMessage: 'reaction is not an emoji or more than one emoji.',
		});
	}


	const messageSelect = {
		id: true,
		body: true,
		creator: {
			select: {
				id: true,
				username: true
			}
		},
		reactions: {
			select: {
				id: true,
				emoji: true,
				users: {
					select: {
						id: true,
						username: true
					}
				}
			}
		},
		invites: {
			select: {
				id: true,
				server: {
					select: {
						id: true,
						name: true,
						participants: {
							select: {
								id: true
							}
						}
					}
				}
			}
		},
	};

	const message = await prisma.message.findFirst({
		where: {
			id: event.context.params.messageId
		},
		select: messageSelect
	});

	if (!message || !message.id) {
		throw createError({
			statusCode: 404,
			statusMessage: `message with id "${event.context.params.messageId}" not found.`,
		});
	}

	const reactionInMessage = message.reactions.find((e) => e.emoji === emoji);

	if (reactionInMessage && reactionInMessage.users.find((e) => e.id === event.context.user.id)) {
		// remove reaction
		await prisma.reaction.update({
			where: {
				id: reactionInMessage.id
			},
			data: {
				users: {
					disconnect: [{ id: event.context.user.id }]
				}
			}
		});

		const updatedMessage = await prisma.message.findFirst({
			where: {
				id: event.context.params.messageId
			},
			select: messageSelect
		});

		global.io.emit(`message-${event.context.params.id}`, { message: updatedMessage });

		return { message: updatedMessage };
	}

	let reaction;
	if (reactionInMessage) {
		// reaction already exists, so up the count by one and add the user to the users who have reacted
		reaction = await prisma.reaction.update({
			where: {
				id: reactionInMessage.id
			},
			data: {
				users: {
					connect: [{
						id: event.context.user.id,
					}]
				},
			}
		});
	} else {
		reaction = await prisma.reaction.create({
			data: {
				emoji,
				users: {
					connect: [{
						id: event.context.user.id,
					}]
				},
				Message: {
					connect: {
						id: message.id,
					}
				}
			}
		});
	}

	if (!reaction.messageId) return;

	const updatedMessage = await prisma.message.findFirst({
		where: {
			id: reaction.messageId,
		},
		select: messageSelect
	});

	global.io.emit(`message-${event.context.params.id}`, { message: updatedMessage });

	return { message: updatedMessage };
});