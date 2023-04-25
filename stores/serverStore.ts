import { IChannel, IServer } from '~/types';

export const useServerStore = defineStore('serverStore', {
	state: () => ({
		servers: [] as IServer[]
	}),
	actions: {
		setServers(servers: IServer[]) {
			this.servers = servers;
		},
		addServer(server: IServer) {
			if (this.servers.find((e) => e.id === server.id)) {
				const index = this.servers.findIndex((e) => e.id === server.id);
				this.servers[index] = server;
				return;
			}
			this.servers.push(server);
		},
		addChannel(serverId: string, channel: IChannel) {
			const serverIndex = this.servers.findIndex(s => s.id === serverId);
			const server = this.servers[serverIndex];
			if (serverIndex < 0 || !server) return;
			if (server.channels.find((c) => c.id === channel.id)) return;
			server.channels.push(channel);
		},
		getByChannelId(channelId: string) {
			return this.servers.find((e: IServer) => e.channels.some((c: IChannel) => c.id === channelId));
		}
	}
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useServerStore, import.meta.hot));
}