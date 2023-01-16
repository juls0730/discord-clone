import bcryptjs from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from '@prisma/client'
import { IUser, SafeUser } from "../../types";
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
	const body = await readBody(event)

	if (!body.username || !body.password) {
		event.node.res.statusCode = 400;
		return {
			message: 'A username, and a password are required to login'
		}
	}

	let user = await prisma.user.findFirst({
		where: {
			username: body.username
		},
		select: {
			id: true,
			username: true,
			passwordhash: true,
			email: true,
		},
	}) as unknown as IUser

	const isCorrect = await bcryptjs.compare(body.password, user.passwordhash)

	if (!isCorrect) {
		event.node.res.statusCode = 401;
		return {
			message: 'Incorrect username or password'
		}
	}

	const token = uuidv4()

	await prisma.session.create({
		data: {
			token,
			userId: user.id
		}
	})

	user = user as SafeUser

	return {
		token,
		userId: user.id,
		user
	}
})