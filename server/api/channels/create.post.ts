import { IServer } from '~/types'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
	if (!event.context.user.authenticated) {
		event.node.res.statusCode = 401;
		return {
			message: 'You must be logged in to view a channel.'
		}
	}

	const { serverName } = await readBody(event)

	if (!serverName) {
		event.node.res.statusCode = 400;
		return {
			message: 'channel name is required to create a channel.'
		}
	}

	const preExistingServer = await prisma.server.findFirst({
		where: {
			name: serverName
		}
	}) as IServer

	if (preExistingServer) {
		event.node.res.statusCode = 409;
		return {
			message: `Server with name ${serverName} already exists.`
		}
	}

	const server = await prisma.server.create({
		data: {
			name: serverName,
			participants: { connect: [{ id: event.context.user.id }] },
			channels: {
				create: [
					{
						name: 'general',
					},
				]
			},
			roles: {
				create: [
					{
						name: 'owner',
						owner: true,
						users: {
							connect: [{ id: event.context.user.id }]
						}
					},
				]
			}
		},
		select: {
			id: true,
			name: true,
			channels: {
				select: {
					id: true,
					DM: true,
					name: true
				}
			},
			participants: {
				select: {
					id: true,
					username: true
				}
			},
			roles: {
				select: {
					id: true,
					name: true,
					administrator: true,
					owner: true,
					users: {
						select: {
							id: true
						}
					}
				}
			}
		}
	}) as unknown as IServer;

	return server
})