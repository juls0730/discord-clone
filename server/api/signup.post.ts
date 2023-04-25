import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
import crypto from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { IUser, SafeUser } from '~/types';
const prisma = new PrismaClient();
dotenv.config();

export default defineEventHandler(async (event) => {
	if (!process.env.SESSION_SECRET_KEY) throw new Error('Session secret missing');

	const body = await readBody(event);

	if (!body.username || !body.password || !body.email) {
		throw createError({
			statusCode: 400,
			statusMessage: 'A username, a password, and an email address are required to singup',
		});
	}

	const preExistingUser = await prisma.user.findFirst({
		where: {
			OR: [
				{
					username: body.username
				},
				{
					email: body.email
				}
			]
		}
	}) as SafeUser;

	if (preExistingUser) {
		throw createError({
			statusCode: 409,
			statusMessage: `User with username ${body.username} or email ${body.email} already exists`,
		});
	}

	const passwordhash = await bcryptjs.hash(body.password, 10);

	const user = await prisma.user.create({
		data: {
			username: body.username,
			passwordhash,
			email: body.email
		},
		select: {
			id: true,
			username: true,
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

	const token = crypto.createHmac('sha1', process.env.SESSION_SECRET_KEY)
		.update(uuidv4())
		.digest('hex');

	await prisma.session.create({
		data: {
			token,
			userId: user.id
		}
	});

	return {
		token,
		user
	};
});
