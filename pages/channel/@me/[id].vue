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
import { useGlobalStore } from '~/stores/store'
import { IChannel } from '~/types'

definePageMeta({
	middleware: 'auth'
})

export default {
	data() {
		return {
			emojiPickerData: storeToRefs(useGlobalStore()).emojiPickerData,
			emojiPickerStyles: {
				top: storeToRefs(useGlobalStore()).emojiPickerData.top + 'px',
				right: storeToRefs(useGlobalStore()).emojiPickerData.right + 'px',
			}
		}
	},
	async setup() {
		const route = useRoute()
		const headers = useRequestHeaders(['cookie']) as Record<string, string>
		const server: IChannel = await $fetch(`/api/channels/${route.params.id}`, { headers })

		if (!server) throw new Error('could not find the dm')

		useGlobalStore().addDM(server);
		if (typeof route.params.id !== 'string') throw new Error('route.params.id must be a string, but got an array presumably?')
		useGlobalStore().setActiveServer('dms', route.params.id);
		useGlobalStore().setActiveChannel(server)
		useGlobalStore().closeEmojiPicker()

		server.messages?.forEach((e) => {
			e.body = parseMessageBody(e.body, useGlobalStore().activeChannel)
		})

		return {
			server
		}
	},
	async updated() {
		const route = useRoute()
		if (typeof route.params.id !== 'string') throw new Error('route.params.id must be a string, but got an array presumably?')
		if (useGlobalStore().activeServer.id !== this.server.id) {
			useGlobalStore().closeEmojiPicker()
			useGlobalStore().setActiveServer('dms', route.params.id)
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

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>