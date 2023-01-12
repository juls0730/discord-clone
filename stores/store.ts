import { Ref } from "vue";
import { SafeUser, IServer, IChannel } from "../types";

export const useGlobalStore = defineStore('global', {
	state: () => ({
		activeServer: {} as IServer,
		user: {} as SafeUser,
		dms: [] as IChannel[],
		servers: [] as IServer[]
	}),
	actions: {
		setUser(user: SafeUser) {
			this.user = user;
		},
		addServer(server: IServer) {
			if (!this.servers || this.servers.find((e) => e.id === server.id)) return;
			this.servers.push(server)
		},
		addDM(dmChannel: IChannel) {
			if (!this.channels || this.channels.find((e) => e.id === dmChannel.id)) return;
			this.channels.push(dmChannel)
		},
		setActive(type: string, serverId: string) {
			if (serverId === '@me') {
				this.activeServer = {} as IServer
				return;
			}
			console.log(this.activeServer)

			const searchableArray: IChannel[] | IServer[] | undefined = this[type]
			if (!searchableArray) return;
			this.activeServer = searchableArray.find((e: IServer | IChannel) => e.id === serverId)
			console.log(this.activeServer, searchableArray.find((e: IServer | IChannel) => e.id === serverId))
		},
	},
})
