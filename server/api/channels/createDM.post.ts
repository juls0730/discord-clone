import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
	if (!event.context.user.authenticated) {
		event.node.res.statusCode = 401;
		return {
			message: 'You must be logged in to view a channel.'
		}
	}

	const { partnerId } = await readBody(event)

	if (!partnerId) {
		event.node.res.statusCode = 400;
		return {
			message: 'A friend is required to create a DM.'
		}
	}

	const partner = await prisma.user.findFirst({
		where: {
			id: partnerId
		}
	})

	const user = await prisma.user.findFirst({
		where: {
			id: event.context.user.id
		}
	})

	if (!partner) {
		event.node.res.statusCode = 400;
		return {
			message: 'No partner found'
		}
	}

	const preExistingServer = await prisma.channel.findFirst({
		where: {
			name: `${user.id}-${partner.id}`,
			DM: true
		}
	})

	if (preExistingServer) {
		event.node.res.statusCode = 409;
		return {
			message: `DM already exists.`
		}
	}

	const server = await prisma.channel.create({
		data: {
			name: `${user.username}-${partner.username}`,
			dmParticipants: { connect: [{ id: event.context.user.id }, { id: partner.id }] },
			DM: true
		},
		include: {
			dmParticipants: true
		}
	})

	return {
		server
	}
})