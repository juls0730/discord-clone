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
			statusMessage: 'A channelId is required',
		});
	}

	const channel = await prisma.channel.findFirst({
		where: {
			id: event.context.params.id
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
							name: true,
						}
					},
				}
			},
			messages: {
				select: {
					id: true,
					body: true,
					createdAt: true,
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
					},
					reactions: {
						select: {
							id: true,
							emoji: true,
							users: {
								select: {
									id: true,
									username: true
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
	}) as IChannel | null;

	if (!channel) {
		throw createError({
			statusCode: 404,
			statusMessage: `Channel with id "${event.context.params.id}" not found`,
		});
	}

	if (channel.serverId && !channel.DM) {
		const server = await prisma.server.findFirst({
			where: {
				id: channel.serverId
			},
			include: {
				participants: true,
				roles: true
			}
		}) as IServer | null;

		if (!server) return;

		const userInServer: Array<SafeUser> | undefined = server.participants.filter((e: SafeUser) => e.id === event.context.user.id);

		if (!userInServer) {
			throw createError({
				statusCode: 401,
				statusMessage: 'You must be in the server to access a channel in that server',
			});
		}

	}

	return channel;
});