<template>
	<MessagePane />
	<div class="fixed mr-3"
		:style="`top: ${emojiPickerData.top}px; right: ${emojiPickerData.right}px`">
		<Transition>
			<EmojiPicker v-on:pickedEmoji="pickedEmoji($event)"
				:opened="emojiPickerData.opened" />
		</Transition>
	</div>
</template>

<script lang="ts">
import { Server } from 'socket.io';
import { useGlobalStore } from '~/stores/store'
import { IChannel } from '~/types'

definePageMeta({
	middleware: 'auth'
})

export default {
	data() {
		return {
			socket: storeToRefs(useGlobalStore()).socket as unknown as Server,
			emojiPickerData: storeToRefs(useGlobalStore()).emojiPickerData,
			emojiPickerStyles: {
				top: storeToRefs(useGlobalStore()).emojiPickerData.top + 'px',
				right: storeToRefs(useGlobalStore()).emojiPickerData.right + 'px',
			}
		}
	},
	mounted() {
		this.socket.on(`addChannel-${this.server.serverId}`, (ev) => {
			const newChannel = ev as IChannel
			useGlobalStore().addChannel(this.server.serverId, newChannel)
		})
	},
	async updated() {
		const route = useRoute()
		const headers = useRequestHeaders(['cookie']) as Record<string, string>;
		if (!this.server) return;

		this.server = await $fetch(`/api/channels/${route.params.id}`, { headers });

		if (typeof route.params.id !== 'string') throw new Error('route.params.id must be a string, but got an array presumiably?')
		if (useGlobalStore().activeChannel.id !== this.server.id) {
			useGlobalStore().closeEmojiPicker()
			useGlobalStore().setActiveServer('servers', route.params.id)
			// update the server with the refreshed data
			useGlobalStore().updateServer(route.params.id, this.server.server)
		}
	},
	async setup() {
		const route = useRoute()
		const headers = useRequestHeaders(['cookie']) as Record<string, string>
		const server: IChannel = await $fetch(`/api/channels/${route.params.id}`, { headers })

		const realServer = useGlobalStore().servers?.find((e) => e.channels.some((el) => el.id == route.params.id))

		if (!realServer) throw new Error('realServer not found, this means that the channel is serverless but not a dm????');
		useGlobalStore().addServer(realServer);
		if (typeof route.params.id !== 'string') throw new Error('route.params.id must be a string, but got an array presumiably?')
		useGlobalStore().setActiveServer('servers', route.params.id)
		useGlobalStore().setActiveChannel(server)
		useGlobalStore().closeEmojiPicker()

		server.messages?.forEach((e) => {
			e.body = parseMessageBody(e.body, useGlobalStore().activeChannel)
		})

		return {
			server,
		}
	},
	methods: {
		pickedEmoji(emoji: string) {
			const { $emit } = useNuxtApp()
			$emit('pickedEmoji', emoji)
			useGlobalStore().closeEmojiPicker()
		},
	}
}
</script>