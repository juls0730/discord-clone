<template>
	<div class="w-full h-full bg-[hsl(220,calc(1*7.7%),22.9%)] relative text-white">
		<div class="w-full h-[calc(100%-60px)] overflow-y-scroll pb-1"
			id="conversation-pane">
			<div>
				<div v-if="conversation.length === 0">
					<p>No messages yet</p>
				</div>
				<div v-else
					v-for="conversations in conversation">
					<div v-if="conversations.userId == user.id"
						class="message-container"
						id="messages-container">
						<div class="message-sender">
							<div class="message-sender-text">
								<p class="message-sender-you">You</p>
								<p>{{ conversations.body }}</p>
							</div>
						</div>
					</div>
					<div v-else
						class="message-container">
						<div class="message-sender">
							<div class="message-sender-text">
								<p class="message-sender-you">{{ conversations.userId }}</p>
								<p>{{ conversations.body }}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="conversation-input w-full">
			<form @submit.prevent="sendMessage"
				class="relative px-4 w-[calc(100%-12rem)]">
				<input type="text"
					class="py-2 px-4 rounded-md bg-[hsl(218,calc(1*7.9%),27.3%)]"
					id="message"
					v-model="messageContent"
					placeholder="Send a Message..." />
				<input type="submit"
					class=""
					value="Send" />
			</form>
		</div>
	</div>
</template>

<script lang="ts">
import { useServerStore } from '~/stores/servers'

export default {
	data() {
		return {
			conversation: [],
			messageContent: ''
		}
	},
	async setup() {
		const route = useRoute()

		const { server } = await $fetch(`/api/channel/${route.params.dmId}`)
		if (!server) return;
		useServerStore().addDM(server);
		const channelId = server.channels[0].id
		await useServerStore().setActive('dms', server.id);
		return {
			server,
			channelId
		}
	},
	async mounted() {
		const { channel } = await $fetch(`/api/channel/messages/${this.channelId}`)
		this.conversation = channel.messages
	},
	async updated() {
		if (!useServerStore().activeServer == this.server) await useServerStore().setActive('dms', this.server.id)
	},
	methods: {
		async sendMessage() {
			const route = useRoute()
			if (!this.messageContent) return;

			const { message } = await $fetch(`/api/channel/sendMessage`, { method: 'post', body: { body: this.messageContent, channelId: this.channelId } })

			this.conversation.push(message)
		}
	},
	props: ['user']
}
</script>

<style scoped>
.conversation-input {
	display: flex;
	position: fixed;
	flex-direction: row;
	margin-top: 0.5rem;
	margin-bottom: 0.5rem;
	height: 60px;
	border-top: #ffffff 1px solid;
	background-color: #3C3C3C;
	bottom: calc(0px - 0.5rem);
}
</style>