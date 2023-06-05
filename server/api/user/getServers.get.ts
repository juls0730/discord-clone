import { IChannel, IServer } from '~/types';
import prisma from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
	if (!event.context.user.authenticated) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Unauthenticated',
		});
	}

	const servers = await prisma.server.findMany({
		where: {
			participants: {
				some: {
					id: event.context.user.id
				}
			}
		},
		select: {
			id: true,
			name: true,
			channels: {
				select: {
					id: true,
				}
			},
		}
	}) as unknown as IServer[] | null;

	const dms = await prisma.channel.findMany({
		where: {
			DM: true,
			dmParticipants: {
				some: {
					id: event.context.user.id
				}
			}
		},
		select: {
			id: true,
			name: true,
			DM: true,
			dmParticipants: {
				select: {
					id: true,
					username: true
				}
			}
		}
	}) as IChannel[] | null;

	return {
		servers, dms
	};
});