import { SafeUser } from '~/types';
import prisma from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
	if (!event.context.user.authenticated) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Unauthenticated',
		});
	}

	const user = await prisma.user.findFirst({
		where: {
			id: event.context.user.id
		},
		select: {
			id: true,
			username: true,
			outgoingFriendRequests: {
				where: {
					status: 'sent'
				},
				select: {
					id: true,
					recipient: {
						select: {
							id: true,
							username: true
						}
					}
				}
			},
			incomingFriendRequests: {
				where: {
					status: 'sent'
				},
				select: {
					id: true,
					sender: {
						select: {
							id: true,
							username: true
						}
					}
				}
			},
			friends: {
				select: {
					id: true,
					username: true,
				}
			}
		}
	}) as SafeUser | null;

	return user;
});