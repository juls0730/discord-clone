import bcryptjs from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
	const body = await readBody(event)

	if (!body.username || !body.password || !body.email) {
		event.node.res.statusCode = 400;
		return {
			message: 'A username, a password, and an email address are required to singup'
		}
	}

	const passwordhash = await bcryptjs.hash(body.password, 10)

	const user = await prisma.user.create({
		data: {
			username: body.username,
			passwordhash,
			email: body.email
		}
	})

	const token = uuidv4()

	await prisma.session.create({
		data: {
			token,
			userId: user.id
		}
	})

	return {
		token,
		userId: user.id
	}
})
