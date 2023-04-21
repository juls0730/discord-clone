import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const cookies = parseCookies(event);

	if (!cookies.sessionToken) {
		event.context.user = { authenticated: false };
		return;
	}

	const session = await prisma.session.findFirst({
		where: {
			token: cookies.sessionToken
		}
	});

	if (!session) {
		event.context.user = { authenticated: false };
		return;
	}

	event.context.user = { authenticated: true, id: session.userId };
});