import { IServer } from '~/types';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	if (!event.context.user.authenticated) {
		throw createError({
			statusCode: 401,
			statusMessage: 'You must be logged in to view a user in a guild.',
		});
	}

	if (!event.context.params?.id || !event.context.params?.guildId) {
		throw createError({
			statusCode: 400,
			statusMessage: 'A userId or guildId is required',
		});
	}

	const { id: userId, guildId } = event.context.params;

	if (!userId || !guildId) throw new Error('id or guild id missing on a dynamic route?');

	const user = await prisma.user.findFirst({
		where: {
			id: userId,
		},
		select: {
			id: true,
			username: true,
			roles: {
				where: {
					serverId: guildId,
				},
				select: {
					id: true,
					name: true,
					administrator: true,
					owner: true,
				},
			},
			createdAt: true,
		},
	});

	return user;
});