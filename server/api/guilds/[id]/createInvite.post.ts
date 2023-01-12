import { IChannel, IInviteCode, IServer, SafeUser } from '~/types'
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

	let body = await readBody(event)

	let expires = false;
	// if (body.expiryDate) {
	// 	expires = true;
	// 	body.expiryDate = new Date(body.expiryDate).getUTCDate()
	// }

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

	const userInServerAndPermited: Array<SafeUser> = server.participants.filter((e: SafeUser) => e.id === event.context.user.id && e.roles?.some((el) => el.administer === true || el.owner === false))

	if (!userInServerAndPermited) {
		event.node.res.statusCode = 401;
		return {
			message: `You must be in the server or an admin/owner of that server to make an invite code`
		}
	}

	const inviteCode = await prisma.inviteCode.create({
		data: {
			server: {
				connect: {
					id: server.id
				}
			},
			maxUses: 0
		}
	}) as IInviteCode

	return inviteCode
})