export const useGlobalStore = defineStore('global', {
	state: () => ({
		activeServer: {},
		user: {}
	}),
	actions: {
		setUser(user) {
			this.user = user;
		},
		addServer(server) {
			if (this.user.servers.find((e) => e.id === server.id)) return;
			this.user.servers.push(server)
		},
		addDM(dmChannel) {
			if (this.user.channels.includes(dmChannel)) return;
			this.user.channels.push(dmChannel)
		},
		setActive(type, serverId) {
			if (serverId === '@me') {
				this.activeServer = {}
				return;
			}

			type = (type === 'dm') ? 'channels' : 'servers'

			this.activeServer = this["user"][type].find((e) => e.id === serverId)
		},
	},
})
