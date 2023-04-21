import { PrismaClient } from '@prisma/client';
import { SafeUser } from '~/types';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	if (!event.context.user.authenticated) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Unauthenticated',
		});
	}

	const user = await prisma.user.findFirst({
		where: {
			id: event.context.user.id
		},
		select: {
			id: true,
			username: true,
			friends: {
				select: {
					id: true,
					username: true,
				}
			}
		}
	}) as SafeUser | null;

	return user;
});