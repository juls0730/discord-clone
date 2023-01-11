import bcryptjs from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from '@prisma/client'
import { IUser } from "../../types";
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
	}) as IUser

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
		}
	}) as IUser

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
