import { IChannel, IMessage, IRole, IServer, SafeUser } from '~/types';

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
		setActiveHome() {
			this.server = {
				server: {} as IServer,
				channel: {} as IChannel
			};

			this.type = 'dm';
		},
		setActiveDM(dm: IChannel) {
			this.server = {
				server: {} as IServer,
				channel: {} as IChannel
			};

			this.type = 'dm';
			this.dm = dm;
		},
		setActiveServer(channel: IChannel, servers: IServer[]) {
			this.dm = {} as IChannel;
			this.type = 'server';

			const activeServer = servers.find((e: IServer) => {
				return e.channels.some((c: IChannel) => c.id === channel.id);
			});

			if (!activeServer) return;

			const activeChannelIndex = activeServer.channels.findIndex((e: IChannel) => e.id === channel.id);

			if (activeChannelIndex < 0) return;

			activeServer.channels[activeChannelIndex] = channel;

			const activeChannel = activeServer.channels[activeChannelIndex];

			activeServer.roles.map((role: IRole) => {
				role.users.map((e: SafeUser) => {
					const userIndex = activeServer.participants.findIndex((user: SafeUser) => user.id === e.id);

					if (activeServer.participants[userIndex] == undefined) return;

					activeServer.participants[userIndex].roles = activeServer.participants[userIndex].roles || [];

					const userRole = role;

					delete(userRole.users);

					activeServer.participants[userIndex].roles.push(userRole);
				});
			});

			delete(activeServer.roles);

			if (!activeChannel) return;

			this.server.server = activeServer;
			this.server.channel = activeChannel;
		},
		getMessageById(id: string) {
			const channel = (this.type === 'server') ? this.server.channel : this.dm;

			return channel.messages.find((e: IMessage) => e.id === id);
		},
		addMessage(message: IMessage) {
			const channel = (this.type === 'server') ? this.server.channel : this.dm;

			if (channel.messages.findIndex((e: IMessage) => e.id === message.id) !== -1) return;

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

			if (!channel.messages.find(m => m.id === messageId)) return;

			channel.messages = channel.messages.filter((e: IMessage) => e.id !== messageId);
		}
	}
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useActiveStore, import.meta.hot));
}