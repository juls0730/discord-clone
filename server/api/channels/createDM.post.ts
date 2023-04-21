import { IChannel, SafeUser } from '~/types';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	if (!event.context.user.authenticated) {
		throw createError({
			statusCode: 401,
			statusMessage: 'You must be logged in to view a channel.',
		});
	}

	const { partnerId } = await readBody(event);

	if (!partnerId) {
		throw createError({
			statusCode: 400,
			statusMessage: 'A friend is required to create a DM.',
		});
	}

	const partner = await prisma.user.findFirst({
		where: {
			id: partnerId
		}
	}) as SafeUser | null;

	const user = await prisma.user.findFirst({
		where: {
			id: event.context.user.id
		}
	}) as SafeUser | null;

	if (!partner) {
		throw createError({
			statusCode: 400,
			statusMessage: 'No partner found',
		});
	}

	if (!user) {
		throw new Error('user not found?');
	}

	const preExistingServer = await prisma.channel.findFirst({
		where: {
			name: `${user.id}-${partner.id}`,
			DM: true
		}
	}) as IChannel;

	if (preExistingServer) {
		throw createError({
			statusCode: 409,
			statusMessage: 'DM already exists.',
		});
	}

	const server = await prisma.channel.create({
		data: {
			name: `${user.id}-${partner.id}`,
			dmParticipants: { connect: [{ id: event.context.user.id }, { id: partner.id }] },
			DM: true
		},
		select: {
			id: true,
			name: true,
			messages: false,
			DM: true,
			dmParticipants: {
				select: {
					id: true,
					username: true
				}
			}
		}
	}) as IChannel;

	return server;
});