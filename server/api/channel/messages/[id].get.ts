import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
	if (!event.context.user.authenticated) return {
		message: 'You must be logged in to view a channel.'
	}

	if (!event.context.params.id) {
		event.node.res.statusCode = 400;
		return {
			message: 'A channelId is required'
		}
	}

	const channel = await prisma.channel.findFirst({
		where: {
			id: event.context.params.id
		},
		include: {
			messages: true,
		}
	})

	if (!channel) {
		event.node.res.statusCode = 404;
		return {
			message: `Channel with id "${event.context.params.id}" not found`
		}
	}

	return {
		channel
	}
})