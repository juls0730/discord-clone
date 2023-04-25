import { IChannel, IMessage, IServer } from '~/types';
import { useServerStore } from './serverStore';

export const useActiveStore = defineStore('activeStore', {
	state: () => ({
		type: '' as 'dm' | 'server',
		dm: {} as IChannel,
		server: {
			server: {} as IServer,
			channel: {} as IChannel
		}
	}),
	actions: {
		setActiveDM(dm: IChannel) {
			this.type = 'dm';
			this.dm = dm;
		},
		setActiveServer(channel: IChannel, servers: IServer[]) {
			this.type = 'server';

			const activeServer = servers.find((e: IServer) => {
				return e.channels.some((c: IChannel) => c.id === channel.id);
			});

			if (!activeServer) return;

			const activeChannelIndex = activeServer.channels.findIndex((e: IChannel) => e.id === channel.id);

			if (activeChannelIndex < 0) return;

			activeServer.channels[activeChannelIndex] = channel;

			const activeChannel = activeServer.channels[activeChannelIndex];

			if (!activeChannel) return;

			this.server.server = activeServer;
			this.server.channel = activeChannel;
		},
		addMessage(message: IMessage) {
			const channel = (this.type === 'server') ? this.server.channel : this.dm;
			channel.messages.push(message);
		},
		updateMessage(message: IMessage) {
			const channel = (this.type === 'server') ? this.server.channel : this.dm;

			const messageIndex = channel.messages.findIndex((e: IMessage) => e.id === message.id);

			if (messageIndex == -1) return;

			channel.messages[messageIndex] = message;
		},
		removeMessage(messageId: string) {
			const channel = (this.type === 'server') ? this.server.channel : this.dm;
			const messageIndex = channel.messages.findIndex((e: IMessage) => e.id === messageId);

			if (messageIndex == -1) return;

			delete(channel.messages[messageIndex]);
		}
	}
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useActiveStore, import.meta.hot));
}