export const useServerStore = defineStore('server', {
  state: () => ({
    servers: [],
    dms: [],
    activeServer: {}
  }),
  actions: {
    addServer(server) {
      if (this.servers.find((e) => e.id === server.id)) return;
      this.servers.push(server)
    },
    addDM(server) {
      if (this.dms.includes(server)) return;
      this.dms.push(server)
    },
    setActive(type, serverId) {
      if (serverId === '@me') {
        this.activeServer = {}
        return;
      }
      this.activeServer = this[type].find((e) => e.id === serverId)
    },
  },
})
