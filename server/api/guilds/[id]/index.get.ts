import { IServer } from '~/types'
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

	const server = await prisma.server.findFirst({
		where: {
			id: event.context.params.id
		},
		include: {
			participants: true,
			channels: true,
			roles: true
		}
	}) as IServer | null;

	if (!server) {
		event.node.res.statusCode = 404;
		return {
			message: `Channel with id "${event.context.params.id}" not found`
		}
	}

	return {
		server
	}
})