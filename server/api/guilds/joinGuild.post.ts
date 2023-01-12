import { IServer } from '~/types'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
	if (!event.context.user.authenticated) return {
		message: 'You must be logged in to view a channel.'
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
		include: {
			server: true
		}
	})

	if (!invite) {
		event.node.res.statusCode = 404;
		return {
			message: `Invite with id "${inviteId}" not found`
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
	}) as IServer

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