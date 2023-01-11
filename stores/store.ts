import { IUser, IServer, IChannel } from "../types";

export const useGlobalStore = defineStore('global', {
	state: () => ({
		activeServer: {} as IServer | Record<string, unknown>,
		user: {} as IUser
	}),
	actions: {
		setUser(user: IUser) {
			this.user = user;
		},
		addServer(server: IServer) {
			if (this.user.servers.find((e) => e.id === server.id)) return;
			this.user.servers.push(server)
		},
		addDM(dmChannel: IChannel) {
			if (this.user.channels.includes(dmChannel)) return;
			this.user.channels.push(dmChannel)
		},
		setActive(type: string, serverId: string) {
			if (serverId === '@me') {
				this.activeServer = {}
				return;
			}

			type = (type === 'dm') ? 'channels' : 'servers'

			if (type !== 'channels' && type !== 'servers') return;

			const searchableArray: IChannel[] | IServer[] = this["user"][type]
			this.activeServer = searchableArray.find((e: IServer | IChannel) => e.id === serverId)
		},
	},
})
