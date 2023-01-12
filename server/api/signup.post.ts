import bcryptjs from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from '@prisma/client'
import { SafeUser } from "~/types";
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
	const body = await readBody(event)

	if (!body.username || !body.password || !body.email) {
		event.node.res.statusCode = 400;
		return {
			message: 'A username, a password, and an email address are required to singup'
		}
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
	}) as SafeUser

	if (preExistingUser) {
		event.node.res.statusCode = 409;
		return {
			message: `User with username ${body.username} or email ${body.email} already exists`
		}
	}

	const passwordhash = await bcryptjs.hash(body.password, 10)

	const user = await prisma.user.create({
		data: {
			username: body.username,
			passwordhash,
			email: body.email
		},
		select: {
			id: true,
			username: true,
			passwordhash: true,
			email: true,
			channels: {
				select: {
					id: true,
					name: true,
					messages: false,
					DM: true,
					dmParticipants: true,
					serverId: true
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
							name: true,
							serverId: true
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
			}
		},
	}) as unknown

	const token = uuidv4()

	await prisma.session.create({
		data: {
			token,
			userId: user.id
		}
	})

	return {
		token,
		userId: user.id,
		user
	}
})
