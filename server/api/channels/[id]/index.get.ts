import { IChannel, IServer, SafeUser } from '../../../../types'
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
		select: {
			id: true,
			name: true,
			server: {
				select: {
					id: true
				}
			},
			messages: {
				select: {
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
									name: true
								}
							}
						}
					}
				}
			},
			DM: true,
			dmParticipants: {
				select: {
					id: true,
					username: true
				}
			},
			serverId: true,
		}
	}) as IChannel | null;

	if (!channel) {
		event.node.res.statusCode = 404;
		return {
			message: `Channel with id "${event.context.params.id}" not found`
		}
	}

	if (channel.serverId && !channel.DM) {
		const server = await prisma.server.findFirst({
			where: {
				id: channel.serverId
			},
			include: {
				participants: true,
				roles: true
			}
		}) as IServer | null;

		const userInServer: Array<SafeUser> | undefined = server?.participants.filter((e: SafeUser) => e.id === event.context.user.id)

		if (!userInServer) {
			event.node.res.statusCode = 401;
			return {
				message: `You must be in the server to access a channel in that server`
			}
		}
	}

	return channel
})