import { IInviteCode, IServer } from '~/types'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
	if (!event.context.user.authenticated) {
		event.node.res.statusCode = 401;
		return {
			message: 'You must be logged in to view a channel.'
		}
	}

	const { inviteId } = await readBody(event);

	if (!inviteId) {
		event.node.res.statusCode = 400;
		return {
			message: 'A inviteId is required'
		}
	}

	const invite = await prisma.inviteCode.findFirst({
		where: {
			id: inviteId
		},
		select: {
			id: true,
			server: {
				select: {
					id: true,
					name: true,
					participants: {
						select: {
							id: true,
						}
					}
				}
			},
			expires: true,
			expiryDate: true,
			maxUses: true
		}
	}) as IInviteCode | null;

	if (!invite) {
		event.node.res.statusCode = 404;
		return {
			message: `Invite with id "${inviteId}" not found`
		}
	}

	const userInServer = invite.server.participants.find((e) => e.id === event.context.user.id);

	if (userInServer) {
		event.node.res.statusCode = 409;
		return {
			message: `You are already in that server.`
		}
	}

	// TODO: check if invite is valid

	const server = await prisma.server.update({
		where: {
			id: invite.server.id
		},
		data: {
			participants: {
				connect: [
					{ id: event.context.user.id }
				]
			}
		},
		include: {
			participants: true,
			channels: true,
			roles: true
		}
	}) as unknown as IServer

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