import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
	if (event.context.user === undefined || event.context.user.id === undefined) {
		// event.node.res.statusCode = 401;
		return {
			message: "Unauthenticated"
		}
	}

	const user = await prisma.user.findFirst({
		where: {
			id: event.context.user.id
		}
	})

	user.passwordhash = undefined;

	return user
})