export const useServerStore = defineStore('server', {
  state: () => ({
    servers: [],
    dms: [],
    activeServer: undefined
  }),
  actions: {
    addServer(server) {
      this.servers.push(server)
    },
    addDM(server) {
      this.dms.push(server)
    }
  },
})
