import { IChannel, IServer, SafeUser } from '~/types'
import emojiRegex from 'emoji-regex'
import { PrismaClient } from '@prisma/client'
import parseBody from '~~/utils/parseMessageBody'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
	if (!event.context.user.authenticated) {
		event.node.res.statusCode = 401;
		return {
			message: 'You must be logged in to send a message.'
		}
	}

	const { id: channelId, messageId } = event.context.params

	const message = await prisma.message.findFirst({
		where: {
			id: messageId,
			channelId: channelId,
		},
		include: {
			creator: true
		}
	})

	if (!message) {
		event.node.res.statusCode = 404;
		return {
			message: `message in channel ${channelId} with id ${messageId} is not found.`
		}
	}

	if (event.context.user.id !== message.creator.id) {
		event.node.res.statusCode = 401;
		return {
			message: 'you are not allowed to delete that message.'
		}
	}

	await prisma.message.delete({
		where: {
			id: message.id
		}
	})

	global.io.emit(`message-${event.context.params.id}`, { message: { id: message.id }, deleted: true });

	return {
		message: 'message successfully deleted.'
	}
})