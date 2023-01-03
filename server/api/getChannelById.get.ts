import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
	if (!event.context.authenticated) return {
		message: 'You must be logged in to view a channel.'
	}

	if (!event.context.params.channelId) {
		event.node.res.statusCode = 400;
		return {
			message: 'A channelId is required'
		}
	}

	const server = await prisma.server.findFirst({
		where: {
			id: event.context.params.channelId
		}
	})

	return {
		server
	}
})