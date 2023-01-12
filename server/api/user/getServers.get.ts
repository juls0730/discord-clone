import { PrismaClient } from '@prisma/client'
import { IServer, IUser } from '~/types'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
	if (!event.context.user.authenticated) {
		// event.node.res.statusCode = 401;
		return {
			message: "Unauthenticated"
		}
	}

	const { servers, channels } = await prisma.user.findFirst({
		where: {
			id: event.context.user.id
		},
		select: {
			channels: {
				select: {
					id: true,
					name: true,
					messages: false,
					DM: true,
					dmParticipants: true
				}
			},
			servers: {
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
				},
			},
		}
	}) as IUser | null;

	return {
		servers, channels
	}
})