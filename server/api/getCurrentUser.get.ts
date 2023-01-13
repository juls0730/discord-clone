import { PrismaClient } from '@prisma/client'
import { SafeUser } from '../../types'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
	if (!event.context.user.authenticated) {
		event.node.res.statusCode = 401;
		return {
			message: "Unauthenticated"
		}
	}

	const user = await prisma.user.findFirst({
		where: {
			id: event.context.user.id
		},
		select: {
			id: true,
			username: true,
		}
	}) as SafeUser | null;

	return user
})