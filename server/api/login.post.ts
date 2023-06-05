import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
import crypto from 'node:crypto';
import { IUser } from '~/types';
import prisma from '~/server/utils/prisma';
dotenv.config();

export default defineEventHandler(async (event) => {
	if (!process.env.SESSION_SECRET_KEY) throw new Error('Session secret missing');

	const body = await readBody(event);

	if (!body.username || !body.password) {
		throw createError({
			statusCode: 400,
			statusMessage: 'A username, and a password are required to login',
		});
	}

	const user = await prisma.user.findFirst({
		where: {
			username: body.username
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
			},
			passwordhash: true,
			servers: {
				select: {
					id: true,
					name: true,
					channels: true,
				}
			},
			channels: {
				select: {
					id: true,
					DM: true,
					dmParticipants: {
						select: {
							id: true,
							username: true,
						}
					}
				}
			}
		},
	}) as unknown as IUser;

	const isCorrect = await bcryptjs.compare(body.password, user.passwordhash);

	if (!isCorrect) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Incorrect username or password',
		});
	}

	const token = crypto.createHmac('sha1', process.env.SESSION_SECRET_KEY)
		.update(uuidv4())
		.digest('hex');

	await prisma.session.create({
		data: {
			token,
			userId: user.id
		}
	});

	user.passwordhash = undefined;

	return {
		token,
		user
	};
});