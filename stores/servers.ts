export const useServerStore = defineStore('server', {
  state: () => ({
    servers: [],
    dms: [],
    activeServer: {}
  }),
  actions: {
    addServer(server) {
      if (this.servers.includes(server)) return;
      this.servers.push(server)
    },
    addDM(server) {
      if (this.dms.includes(server)) return;
      this.dms.push(server)
    },
    setActive(type, serverId) {
      this.activeServer = this[type].find((e) => e.id === serverId)
    },
  },
})
