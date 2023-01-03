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

	const preExistingServer = await prisma.server.findFirst({
		where: {
			name: `${user.username} and ${partner.username}`
		}
	})

	if (preExistingServer) {
		event.node.res.statusCode = 409;
		return {
			message: `DM already exists.`
		}
	}

	const server = await prisma.server.create({
		data: {
			name: `${user.username} and ${partner.username}`,
			participants: { connect: [{ id: event.context.user.id }, { id: partner.id }] },
			channels: {
				create: [
					{
						name: 'default',
					},
				]
			}
		},
		include: {
			channels: true,
			participants: true
		}
	})

	return {
		server
	}
})