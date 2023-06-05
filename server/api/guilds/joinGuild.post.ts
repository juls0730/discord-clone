import { IInviteCode, IServer } from '~/types';
import prisma from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
	if (!event.context.user.authenticated) {
		throw createError({
			statusCode: 401,
			statusMessage: 'You must be logged in to view a channel.',
		});
	}

	const { inviteId } = await readBody(event);

	if (!inviteId) {
		throw createError({
			statusCode: 400,
			statusMessage: 'A inviteId is required',
		});
	}

	const invite = await prisma.inviteCode.findFirst({
		where: {
			id: inviteId
		},
		select: {
			id: true,
			server: {
				select: {
					id: true,
					name: true,
					participants: {
						select: {
							id: true,
						}
					}
				}
			},
			expires: true,
			expiryDate: true,
			maxUses: true
		}
	}) as IInviteCode | null;

	if (!invite) {
		throw createError({
			statusCode: 404,
			statusMessage: `Invite with id "${inviteId}" not found`,
		});
	}

	const userInServer = invite.server.participants.find((e) => e.id === event.context.user.id);

	if (userInServer) {
		throw createError({
			statusCode: 409,
			statusMessage: 'You are already in that server.',
		});
	}

	// TODO: check if invite is valid

	const server = await prisma.server.update({
		where: {
			id: invite.server.id
		},
		data: {
			participants: {
				connect: [
					{ id: event.context.user.id }
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

	if (!server) {
		throw createError({
			statusCode: 404,
			statusMessage: `Channel with id "${event.context.params?.id}" not found`,
		});
	}

	return {
		server
	};
});