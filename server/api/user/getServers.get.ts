import { PrismaClient } from '@prisma/client'
import { IChannel, IServer, IUser } from '~/types'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
	if (!event.context.user.authenticated) {
		event.node.res.statusCode = 401;
		return {
			message: "Unauthenticated"
		}
	}

	const servers = await prisma.server.findMany({
		where: {
			participants: {
				some: {
					id: event.context.user.id
				}
			}
		},
		select: {
			id: true,
			name: true,
			channels: {
				select: {
					id: true,
					DM: true,
					name: true,
					server: {
						select: {
							id: true,
							name: true,
							participants: {
								select: {
									id: true,
									username: true
								}
							},
							channels: {
								select: {
									id: true,
									DM: true,
									name: true,
									messages: {
										select: {
											id: true,
											body: true,
											creator: {
												select: {
													id: true,
													username: true
												}
											},
											invites: {
												select: {
													id: true,
													server: {
														select: {
															id: true,
															name: true,
															participants: {
																select: {
																	id: true
																}
															}
														}
													}
												}
											},
											reactions: {
												select: {
													id: true,
													emoji: true,
													count: true,
													users: {
														select: {
															id: true,
															username: true
														}
													}
												}
											}
										}
									}
								}
							},
						}
					},
				},
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
		}
	}) as unknown as IServer[] | null;

	const dms = await prisma.channel.findMany({
		where: {
			DM: true,
			dmParticipants: {
				some: {
					id: event.context.user.id
				}
			}
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
	}) as IChannel[] | null;

	return {
		servers, dms
	}
})