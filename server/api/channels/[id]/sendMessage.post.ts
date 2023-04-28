import { IChannel, IServer, SafeUser, IMessage } from '~/types';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

declare global {
	let io: Server;
}

export default defineEventHandler(async (event) => {
	if (!event.context.user.authenticated) {
		throw createError({
			statusCode: 401,
			statusMessage: 'You must be logged in to send a message.',
		});
	}

	if (!event.context.params?.id) return;

	const req = await readBody(event);

	const channelId = event.context.params.id;

	if (!req.body || !channelId || !req.body.trim()) {
		throw createError({
			statusCode: 400,
			statusMessage: 'A body is required to send a message.',
		});
	}

	let { body } = req;

	if (body.length > 5000) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Message is larger than 5000 characters.'
		});
	}

	const channel = await prisma.channel.findFirst({
		where: {
			id: channelId
		},
		select: {
			id: true,
			name: true,
			messages: false,
			DM: true,
			serverId: true,
			dmParticipants: {
				select: {
					id: true,
					username: true
				}
			}
		}
	}) as IChannel | null;

	if (!channel) {
		throw createError({
			statusCode: 404,
			statusMessage: `Channel with id "${channelId}" not found.`,
		});
	}

	if (!channel.DM) {
		const server = await prisma.server.findFirst({
			where: {
				id: channel.serverId
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
		}) as IServer | null;

		if (!server) {
			throw new Error(`server with id "${channel.serverId}" is not found but channel with id "${channel.id}" is not a dm?`);
		}

		const userInServer: SafeUser | undefined = server.participants.find((e: SafeUser) => e.id === event.context.user.id);

		if (!userInServer) {
			throw createError({
				statusCode: 401,
				statusMessage: 'You must be in the server to send a message.',
			});
		}

		if (!server) {
			throw createError({
				statusCode: 404,
				statusMessage: 'Server not found',
			});
		}
	} else {
		const userInDM: SafeUser | undefined = channel.dmParticipants?.find((e) => e.id === event.context.user.id);

		if (!userInDM) {
			throw createError({
				statusCode: 401,
				statusMessage: 'You must be in the DM to send a message.',
			});
		}
	}

	// TODO: make this client side or something because it's bug ridden right now lmao
	const inviteCodes = body.match(/<&([a-z]|[0-9]){25}>/g);

	const invites: { id: string; }[] = [];
	if (inviteCodes) {
		inviteCodes.forEach((e: string) => {
			if (!e) return;
			const opBody = body;
			body = body.split(e).join('');
			if (opBody === body) return;
			const id = e.split('<&')[1]?.split('>')[0];
			if (!id) return;
			invites.push({ id });
		});
	}

	const message = await prisma.message.create({
		data: {
			body,
			creator: {
				connect: {
					id: event.context.user.id
				}
			},
			channel: {
				connect: {
					id: channelId
				}
			},
			invites: {
				connect: invites
			}
		},
		select: {
			id: true,
			body: true,
			createdAt: true,
			creator: {
				select: {
					id: true,
					username: true,
				}
			},
			invites: {
				select: {
					id: true,
					expires: true,
					expiryDate: true,
					maxUses: true,
					server: {
						select: {
							id: true,
							name: true,
							participants: true
						}
					}
				}
			}
		}
	}) as unknown as IMessage;


	global.io.emit(`message-${channel.id}`, { message });

	return message;
});