import { IChannel, IServer, SafeUser, IMessage } from '~/types'
import { Server } from 'socket.io'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

declare global {
	var io: Server
}

export default defineEventHandler(async (event) => {
	if (!event.context.user.authenticated) {
		event.node.res.statusCode = 401;
		return {
			message: 'You must be logged in to send a message.'
		}
	}

	let { body, channelId } = await readBody(event)

	if (!body || !channelId) {
		event.node.res.statusCode = 400;
		return {
			message: 'A body or channelId is required to send a message.'
		}
	}

	const channel = await prisma.channel.findFirst({
		where: {
			id: channelId
		},
		include: {
			dmParticipants: true
		}
	}) as IChannel

	if (!channel.DM) {
		const server = await prisma.server.findFirst({
			where: {
				id: channel.serverId
			},
			include: {
				participants: true
			}
		}) as IServer

		const userInServer: SafeUser | undefined = server.participants.find((e: SafeUser) => e.id === event.context.user.id)

		if (!userInServer) {
			event.node.res.statusCode = 401;
			return {
				message: 'You must be in the server to send a message.'
			}
		}

		if (!server) {
			event.node.res.statusCode = 404;
			return {
				message: 'Server not found'
			}
		}
	} else {
		const userInDM: SafeUser | undefined = channel.dmParticipants?.find((e) => e.id === event.context.user.id)

		if (!userInDM) {
			event.node.res.statusCode = 401;
			return {
				message: 'You must be in the DM to send a message.'
			}
		}
	}

	const matches = body.match(/<&([a-z]|[0-9]){25}>/g);

	let invites: { id: string; }[] = [];
	if (matches) {
		matches.forEach((e: string) => {
			if (!e) return
			const opBody = body;
			body = body.split(e).join('')
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
	}) as unknown as IMessage


	global.io.emit(`message-${channel.id}`, { message });

	return message
})