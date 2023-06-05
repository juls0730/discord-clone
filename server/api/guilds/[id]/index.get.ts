import { IServer } from '~/types';
import prisma from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
	if (!event.context.user.authenticated) {
		throw createError({
			statusCode: 401,
			statusMessage: 'You must be logged in to view a channel.',
		});
	}

	if (!event.context.params?.id) {
		throw createError({
			statusCode: 400,
			statusMessage: 'A channelId is required',
		});
	}

	const server = await prisma.server.findFirst({
		where: {
			id: event.context.params.id
		},
		select: {
			id: true,
			name: true,
			participants: {
				select: {
					id: true,
					username: true
				}
			},
			channels: {
				select: {
					id: true,
					DM: true,
					name: true,
				}
			},
			roles: {
				select: {
					id: true,
					name: true,
					administrator: true,
					owner: true,
					users: {
						select: {
							id: true
						}
					}
				}
			}
		}
	}) as IServer | null;

	if (!server) {
		throw createError({
			statusCode: 404,
			statusMessage: `Channel with id "${event.context.params.id}" not found`,
		});
	}

	if (!server.participants.find((participant) => participant.id === event.context.user.id)) {
		throw createError({
			statusCode: 403,
			statusMessage: `Can't find participant with id "${event.context.params.id}" in guild with id "${event.context.params.id}"`,
		});
	}

	return server;
});