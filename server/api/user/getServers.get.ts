import { IUser } from '~/types'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
	if (!event.context.user.authenticated) {
		// event.node.res.statusCode = 401;
		return {
			message: "Unauthenticated"
		}
	}

	const servers = await prisma.user.findFirst({
		where: {
			id: event.context.user.id
		},
		include: {
			channels: true
		}
	}) as IUser

	servers.passwordhash = undefined;

	return servers
})