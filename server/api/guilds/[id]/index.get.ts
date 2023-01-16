import { IServer } from '~/types'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
	if (!event.context.user.authenticated) {
		event.node.res.statusCode = 401;
		return {
			message: 'You must be logged in to view a channel.'
		}
	}

	if (!event.context.params.id) {
		event.node.res.statusCode = 400;
		return {
			message: 'A channelId is required'
		}
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
							},
							reactions: {
								select: {
									id: true,
									emoji: true,
									count: true,
									users: {
										select: {
											id: true,
											username: true
										}
									}
								}
							}
						}
					}
				}
			},
		}
	}) as IServer | null;

	if (!server) {
		event.node.res.statusCode = 404;
		return {
			message: `Channel with id "${event.context.params.id}" not found`
		}
	}

	return {
		server
	}
})