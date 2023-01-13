import { SafeUser, IServer, IChannel } from "../types";

export const useGlobalStore = defineStore('global', {
	state: () => ({
		activeServer: {} as IServer | IChannel,
		activeServerType: '' as "dms" | "servers" | undefined,
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
			if (!this.dms || this.dms.find((e) => e.id === dmChannel.id)) return;
			this.dms.push(dmChannel)
		},
		setServers(servers: Array<IServer>) {
			this.servers = servers
		},
		setDms(dms: Array<IChannel>) {
			this.dms = dms
		},
		setActive(type: "servers" | "dms", channelId: string) {
			if (channelId === '@me') {
				this.activeServer = {} as IServer | IChannel
				this.activeServerType = 'dms'
				return;
			}

			this.activeServerType = type

			const searchableArray: IChannel[] | IServer[] | undefined = this[type]
			if (!searchableArray) return;
			let activeServerIndex: number;
			if (type === 'servers') {
				activeServerIndex = searchableArray.findIndex((e) => {
					return e.channels.some((channel: IChannel) => channel.id === channelId)
				})
			} else {
				activeServerIndex = searchableArray.findIndex((e) => {
					return e.id === channelId
				})
			}

			this.activeServer = this.servers[activeServerIndex]
		},
	},
})
