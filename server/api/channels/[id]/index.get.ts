import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
	if (!event.context.user.authenticated) {
		return {
			message: 'You must be logged in to view a channel.'
		}
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
			dmParticipants: true
		}
	})

	if (!channel) {
		event.node.res.statusCode = 404;
		return {
			message: `Channel with id "${event.context.params.id}" not found`
		}
	}

	if (channel.id && !channel.DM) {
		const server = await prisma.server.findFirst({
			where: {
				id: channel.id
			},
			include: {
				participants: true
			}
		})


		const userInServer = server.participants.filter((e) => e.id === event.context.user.id)

		if (!userInServer) {
			event.node.res.statusCode = 401;
			return {
				message: `You must be in the server to access a channel in that server`
			}
		}
	}

	return {
		channel
	}
})