import { IChannel, IServer, SafeUser } from '~/types';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

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
			statusMessage: 'A serverId is required',
		});
	}

	const { channelName } = await readBody(event);

	const server = await prisma.server.findFirst({
		where: {
			id: event.context.params.id
		},
		include: {
			participants: true,
			channels: true,
			roles: true
		}
	}) as IServer | null;

	if (!server) {
		throw createError({
			statusCode: 404,
			statusMessage: `Server with id "${event.context.params.id}" not found`,
		});
	}

	const userInServer: Array<SafeUser> = server.participants.filter((e: SafeUser) => e.id === event.context.user.id);

	if (!userInServer) {
		throw createError({
			statusCode: 401,
			statusMessage: 'You must be in the server to access a channel in that server',
		});
	}

	if (server.channels?.find((e) => e.name === channelName)) {
		throw createError({
			statusCode: 409,
			statusMessage: `Channel with name "${channelName}" already exists in server with id "event.context.user.id"`,
		});
	}

	const channel = await prisma.channel.create({
		data: {
			name: channelName,
			server: {
				connect: {
					id: server.id
				}
			}
		},
		select: {
			id: true,
			name: true,
			server: {
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
							name: true
						}
					},
				}
			},
			messages: {
				select: {
					id: true,
					body: true,
					creator: {
						select: {
							id: true,
							username: true
						}
					},
					invites: {
						select: {
							id: true,
							server: {
								select: {
									id: true,
									name: true,
									participants: {
										select: {
											id: true
										}
									}
								}
							}
						}
					}
				}
			},
			DM: true,
			dmParticipants: {
				select: {
					id: true,
					username: true
				}
			},
			serverId: true,
		}
	}) as IChannel;

	global.io.emit(`addChannel-${server.id}`, channel);

	return channel;
});