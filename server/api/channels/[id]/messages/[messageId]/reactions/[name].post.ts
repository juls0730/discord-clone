import { IChannel, IServer, SafeUser } from '~/types'
import { PrismaClient } from '@prisma/client'
import { node } from 'unenv'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
	if (!event.context.user.authenticated) {
		event.node.res.statusCode = 401;
		return {
			message: 'You must be logged in to send a message.'
		}
	}

	const emoji = decodeURIComponent(event.context.params.name)

	if (emoji.length !== 2) {
		event.node.res.statusCode = 400;
		return {
			message: 'reaction is not an emoji or more than one emoji.'
		}
	}
	
	const first = emoji.charCodeAt(0);
	const second = emoji.charCodeAt(1);

	if (!((first >= 0xD800 && first <= 0xDBFF) && (second >= 0xDC00 && second <= 0xDFFF))) {
		event.node.res.statusCode = 400;
		return {
			message: 'reaction is not an emoji or more than one emoji.'
		}
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
		reactions: {
			select: {
				id: true,
				emoji: true,
				count: true,
				users: {
					select: {
						id: true,
						username: true
					}
				}
			}
		}
	}

	const message = await prisma.message.findFirst({
		where: {
			id: event.context.params.messageId
		},
		select: messageSelect
	})

	if (!message.id) {
		event.node.res.statusCode = 404;
		return {
			message: `message with id "${event.context.params.messageId}" not found.`
		}
	}

	const reactionInMessage = message.reactions.find((e) => e.emoji.name === emoji)

	let count;

	if (reactionInMessage?.count) {
		count = reactionInMessage.count + 1;
	} else {
		count = 1;
	}

	if (reactionInMessage && reactionInMessage.users.find((e) => e.id === event.context.user.id)) {
		// remove reaction
		await prisma.reaction.update({
			where: {
				id: reactionInMessage.id
			},
			data: {
				count: reactionInMessage.count - 1,
				users: {
					disconnect: [{ id: event.context.user.id }]
				}
			}
		})

		const updatedMessage = await prisma.message.findFirst({
			where: {
				id: event.context.params.messageId
			},
			select: messageSelect
		})

		global.io.emit(`message-${event.context.params.id}`, { message: updatedMessage });

		return { message: updatedMessage }
	}

	let reaction;
	if (reactionInMessage) {
		// reaction already exists, so up the count by one and add the user to the users who have reacted
		reaction = await prisma.reaction.update({
			where: {
				id: reactionInMessage.id
			},
			data: {
				count,
				users: {
					connect: [{
						id: event.context.user.id,
					}]
				},
			}
		})
	} else {
		reaction = await prisma.reaction.create({
			data: {
				emoji: {
					name: emoji,
					id: null
				},
				count: count,
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
		})
	}

	if (!reaction.messageId) return;

	const updatedMessage = await prisma.message.findFirst({
		where: {
			id: reaction.messageId,
		},
		select: messageSelect
	})

	global.io.emit(`message-${event.context.params.id}`, { message: updatedMessage });

	return { message: updatedMessage }
})