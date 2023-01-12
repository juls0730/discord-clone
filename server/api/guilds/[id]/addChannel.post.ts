import { IChannel, IServer, SafeUser } from '~/types'
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
			message: 'A serverId is required'
		}
	}

	const { channelName } = await readBody(event)

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
			message: `Server with id "${event.context.params.id}" not found`
		}
	}

	const userInServer: Array<SafeUser> = server.participants.filter((e: SafeUser) => e.id === event.context.user.id)

	if (!userInServer) {
		event.node.res.statusCode = 401;
		return {
			message: `You must be in the server to access a channel in that server`
		}
	}

	if (server.channels?.find((e) => e.name === channelName)) {
		event.node.res.statusCode = 409;
		return {
			message: `Channel with name "${channelName}" already exists in server with id "event.context.user.id"`
		}
	}

	const channel = await prisma.channel.create({
		data: {
			name: channelName,
			server: {
				connect: {
					id: server.id
				}
			}
		}
	}) as IChannel

	return channel
})