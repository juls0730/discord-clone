import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
	const cookies = parseCookies(event)

	if (!cookies.sessionToken) return;

	const session = await prisma.session.findFirst({
		where: {
			token: cookies.sessionToken
		}
	})

	if (!session) return;
	
	event.context.authenticated = true;
})