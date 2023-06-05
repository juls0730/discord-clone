import { Server, Socket } from 'socket.io';
import { IChannel, IServer, IUser, SafeUser } from '~/types';
import prisma from '~/server/utils/prisma';

export default defineEventHandler(({ node }) => {
	if (global.io) return; 
	
	global.io = new Server(node.res.socket?.server);

	global.io.on('connection', async (socket: Socket) => {
		const token = socket.handshake.auth.token;

		if (!token) {
			socket.disconnect();
			return;
		}

		const { user } = await prisma.session.findFirst({
			where: {
				token
			},
			select: {
				user: {
					select: {
						id: true,
						username: true,
						servers: {
							select: {
								id: true,
								name: true,
								participants: {
									select: {
										id: true,
										username: true,
										roles: {
											select: {
												id: true,
												administrator: true,
												owner: true
											}
										}
									}
								},
								channels: {
									select: {
										id: true,
										DM: true,
										server: {
											select: {
												id: true,
												name: true,
												participants: {
													select: {
														id: true,
														username: true,
														roles: {
															select: {
																id: true,
																administrator: true,
																owner: true
															}
														}
													}
												},
											}
										}
									}
								}
							}
						},
						channels: {
							select: {
								id: true,
								DM: true,
								dmParticipants: {
									select: {
										id: true,
										username: true
									}
								},
							}
						}
					}
				}
			}
		}) as unknown as { user: IUser };

		if (!user) {
			socket.disconnect();
			return;
		}

		socket.on('typing', async (ev) => {
			if (!ev) {
				return;
			}

			let channel = user.channels?.find((c: IChannel) => c.id === ev) || user.servers?.find((s: IServer) => s.channels.some((c: IChannel) => c.id === ev));
			if (channel?.DM === undefined) {
				// assume its a server
				channel = channel?.channels.find((c: IChannel) => c.id === ev);
			}

			if (!channel) return;

			if (!channel.dmParticipants?.find((e: SafeUser) => e.id === user.id)) {
				if (!channel.server || !channel.server.participants.find((e: SafeUser) => e.id === user.id)) {
					return;
				}
			}

			global.io.emit(`typing-${channel.id}`, user.username);
		});
	});
});