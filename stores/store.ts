import { channel } from "diagnostics_channel";
import { serve } from "esbuild";
import { Socket } from "socket.io-client";
import { SafeUser, IServer, IChannel, IMessage, IEmojiPickerData } from "../types";

export const useGlobalStore = defineStore('global', {
	state: () => ({
		activeChannel: {} as IChannel,
		activeServer: {} as IServer | IChannel,
		activeServerType: '' as "dms" | "servers" | undefined,
		user: {} as SafeUser,
		dms: [] as IChannel[],
		servers: [] as IServer[],
		emojiPickerData: {} as IEmojiPickerData,
		socket: null as unknown
	}),
	actions: {
		setActiveServer(type: "servers" | "dms", channelId: string) {
			if (channelId === '@me') {
				this.activeServer = {} as IServer | IChannel
				this.activeServerType = 'dms'
				return;
			}

			this.activeServerType = type

			const searchableArray: IChannel[] | IServer[] | undefined = this[type]
			if (!searchableArray) return;
			let activeServer: number;
			if (type === 'servers') {
				activeServer = searchableArray.find((e) => {
					return e.channels.some((channel: IChannel) => channel.id === channelId)
				})
			} else {
				activeServer = searchableArray.find((e) => {
					return e.id === channelId
				})
			}

			this.activeServer = activeServer
		},
		setActiveChannel(channel: IChannel) {
			this.activeChannel = channel;
		},
		updateServer(channelId: string, server: IServer) {
			const serverIndex = this.servers.findIndex(s => s.channels.some((c) => c.id === channelId))
			this.servers[serverIndex] = server
		},
		setServers(servers: Array<IServer>) {
			this.servers = servers
		},
		addChannel(serverId: string, channel: IChannel) {
			const serverIndex = this.servers.findIndex(s => s.id === serverId)
			const server = this.servers[serverIndex]
			if (serverIndex < 0 || !server) return;
			if (server.channels.find((c) => c.id === channel.id)) return;
			server.channels.push(channel)
		},
		addDM(dmChannel: IChannel) {
			if (this.dms.find((e) => e.id === dmChannel.id)) {
				const index = this.dms.findIndex((e) => e.id === dmChannel.id)
				this.dms[index] = dmChannel
				return;
			}
			this.dms.push(dmChannel)
		},
		addServer(server: IServer) {
			if (this.servers.find((e) => e.id === server.id)) {
				const index = this.servers.findIndex((e) => e.id === server.id)
				this.servers[index] = server
				return;
			}
			this.servers.push(server)
		},
		setDms(dms: Array<IChannel>) {
			this.dms = dms
		},
		setSocket(socket: Socket) {
			this.socket = socket
		},
		setUser(user: SafeUser) {
			this.user = user;
		},
		updateMessage(messageId: string, message: IMessage) {
			const messageIndex = this.activeChannel.messages.findIndex((e) => e.id === messageId)
			if (messageIndex < 0) return;
			this.activeChannel.messages[messageIndex] = message
		},
		removeMessage(messageId: string) {
			if (!this.activeChannel.messages.find(m => m.id === messageId)) return;
			this.activeChannel.messages = this.activeChannel.messages.filter(m => m.id !== messageId)
		},
		openEmojiPicker(payload: IEmojiPickerData) {
			this.emojiPickerData.top = payload.top;
			this.emojiPickerData.right = payload.right;
			this.emojiPickerData.openedBy = payload.openedBy;
			this.emojiPickerData.opened = true;
		},
		toggleEmojiPicker(payload: IEmojiPickerData) {
			let messageId;
			if (this.emojiPickerData.openedBy === undefined) {
				messageId = null
			} else {
				messageId = this.emojiPickerData.openedBy.messageId || null
			}

			console.log(!this.emojiPickerData.opened || payload.openedBy.messageId !== messageId, this.emojiPickerData.opened, payload.openedBy.messageId, messageId)

			if (!this.emojiPickerData.opened || payload.openedBy.messageId !== messageId) {
				this.openEmojiPicker(payload)
			} else {
				this.closeEmojiPicker()
			}
		},
		closeEmojiPicker() {
			console.log('closeEmojiPicker')
			if (this.emojiPickerData.openedBy) this.emojiPickerData.openedBy.messageId = '';
			this.emojiPickerData.opened = false;
		},
		logout() {
			this.dms = []
			this.servers = []
			this.socket = null
			this.activeServer = {} as IChannel
		}
	},
})
