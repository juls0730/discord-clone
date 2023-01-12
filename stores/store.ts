import { Ref } from "vue";
import { SafeUser, IServer, IChannel } from "../types";

export const useGlobalStore = defineStore('global', {
	state: () => ({
		activeServer: {} as IServer,
		user: {} as SafeUser
	}),
	actions: {
		setUser(user: SafeUser) {
			this.user = user;
		},
		addServer(server: IServer) {
			if (!this.user.servers || this.user.servers.find((e) => e.id === server.id)) return;
			this.user.servers.push(server)
		},
		addDM(dmChannel: IChannel) {
			if (!this.user.channels || this.user.channels.find((e) => e.id === dmChannel.id)) return;
			this.user.channels.push(dmChannel)
		},
		setActive(type: string, serverId: string) {
			if (serverId === '@me') {
				this.activeServer = {} as IServer
				return;
			}
			console.log(this.activeServer)
			if (!this.user.channels || !this.user.servers) return;

			type = (type === 'dm') ? 'channels' : 'servers'

			if (type !== 'channels' && type !== 'servers') return;

			const searchableArray: IChannel[] | IServer[] | undefined = this["user"][type]
			if (!searchableArray) return;
			const activeServer = searchableArray.find((e: IServer | IChannel) => e.id === serverId)
			console.log(searchableArray, this["user"], activeServer)

			if (!activeServer) return;

			this.activeServer = activeServer
			console.log(this.activeServer)
		},
	},
})
