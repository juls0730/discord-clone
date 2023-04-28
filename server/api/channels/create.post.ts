import { IServer } from '~/types';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	if (!event.context.user.authenticated) {
		throw createError({
			statusCode: 401,
			statusMessage: 'You must be logged in to view a channel.',
		});
	}

	const body = await readBody(event);

	if (!body) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Server name is required to create a Server.',
		});
	}

	const { serverName } = body;

	const server = await prisma.server.create({
		data: {
			name: serverName,
			participants: { connect: [{ id: event.context.user.id }] },
			channels: {
				create: [
					{
						name: 'general',
					},
				]
			},
			roles: {
				create: [
					{
						name: 'owner',
						owner: true,
						users: {
							connect: [{ id: event.context.user.id }]
						}
					},
				]
			}
		},
		select: {
			id: true,
			name: true,
			channels: {
				select: {
					id: true,
					DM: true,
					name: true
				}
			},
			participants: {
				select: {
					id: true,
					username: true
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
	}) as unknown as IServer;

	return server;
});