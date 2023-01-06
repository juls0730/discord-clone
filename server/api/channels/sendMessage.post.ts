import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
	if (!event.context.user.authenticated) {
		event.node.res.statusCode = 401;
		return {
			message: 'You must be logged in to send a message.'
		}
	}

	const { body, channelId } = await readBody(event)

	if (!body || !channelId) {
		event.node.res.statusCode = 400;
		return {
			message: 'A body or channelId is required to send a message.'
		}
	}

	const channel = await prisma.channel.findFirst({
		where: {
			id: channelId
		},
		include: {
			dmParticipants: true
		}
	})

	console.log(channel)

	if (!channel.DM) {
		const server = await prisma.server.findFirst({
			where: {
				id: channel.serverId
			},
			include: {
				participants: true
			}
		})

		const userInServer = server.participants.filter((e) => e.id === event.context.user.id)

		if (!userInServer.length > 0) {
			event.node.res.statusCode = 401;
			return {
				message: 'You must be in the server to send a message.'
			}
		}

		if (!server) {
			event.node.res.statusCode = 404;
			return {
				message: 'Server not found'
			}
		}
	} else {
		const userInDM = channel.dmParticipants.filter((e) => e.id === event.context.user.id)

		if (!userInDM.length > 0) {
			event.node.res.statusCode = 401;
			return {
				message: 'You must be in the DM to send a message.'
			}
		}
	}

	const message = await prisma.message.create({
		data: {
			body,
			creator: {
				connect: {
					id: event.context.user.id
				}
			},
			channel: {
				connect: {
					id: channelId
				}
			}
		}
	})

	return {
		message
	}
})