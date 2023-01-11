<template>
	<div class="h-full bg-[hsl(220,calc(1*7.7%),22.9%)] relative text-white">
		<div class="w-full h-[calc(100%-60px)] overflow-y-scroll pb-1"
			id="conversation-pane">
			<div>
				<div v-if="!conversation">
					<p>No messages yet</p>
				</div>
				<div v-else
					v-for="message in conversation">
					<div class="message-container">
						<div>
							<div class="message-sender-text">
								<p :class="(message.userId == user.id) ? 'message-sender-you' : 'message-sender'">
									{{ message.userId }}</p>
								<p class="break-words max-w-full">{{ message.body }}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="conversation-input w-[calc(100vw-88px-240px)]">
			<form @submit.prevent="sendMessage"
				@keydown.enter="sendMessage"
				class="relative px-4 w-full">
				<div id="textbox"
					class="px-4 rounded-md w-full h-[44px] bg-[hsl(218,calc(1*7.9%),27.3%)] placeholder:text-[hsl(218,calc(1*4.6%),46.9%)] flex flex-row">
					<textarea type="text"
						id="messageBox"
						class="bg-transparent focus:outline-none py-2 w-full resize-none leading-relaxed"
						v-model="messageContent"
						placeholder="Send a Message..." />
					<input type="submit"
						class="absolute -top-full -left-full invisible"
						id="submit">
					<label for="submit"
						class="py-1 px-1.5 h-fit my-auto cursor-pointer"
						role="button"><svg width="32"
							height="32"
							viewBox="0 0 24 24">
							<path fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 14L21 3m0 0l-6.5 18a.55.55 0 0 1-1 0L10 14l-7-3.5a.55.55 0 0 1 0-1L21 3" />
						</svg></label>
				</div>
			</form>
		</div>
	</div>
</template>

<script async setup lang="ts">

</script>

<script lang="ts">
import { useGlobalStore } from '~/stores/store';
import { io } from 'socket.io-client'

export default {
	props: ['server'],
	data() {
		return {
			user: useGlobalStore().user,
			messageContent: '',
			conversation: this.server.messages
		}
	},
	mounted() {
		const route = useRoute()
		const socket = io();

		const conversationDiv = document.getElementById('conversation-pane');
		if (!conversationDiv) throw new Error('wtf');
		setTimeout(() => {
			conversationDiv.scrollTop = conversationDiv.scrollHeight;
		})

		socket.on('connect', () => {
			// listen for messages from the server
			socket.on(`message-${route.params.id}`, (ev) => {
				const { message } = ev
				console.log(message.userId, this.user.id, message, this.conversation)
				if (message.userId == this.user.id) return;

				this.conversation.push(message)

				const lastElementChild = conversationDiv.children[0]?.lastElementChild
				if (!lastElementChild) return;

				setTimeout(() => {
					console.log(conversationDiv.scrollTop, conversationDiv.scrollHeight, conversationDiv.clientHeight, lastElementChild.clientHeight, (conversationDiv.scrollHeight - conversationDiv.clientHeight) - lastElementChild.clientHeight)
					if (conversationDiv.scrollTop + 11.2 < (conversationDiv.scrollHeight - conversationDiv.clientHeight) - lastElementChild.clientHeight) return;
					conversationDiv.scrollTop = conversationDiv.scrollHeight;
				})
			})
		});
	},
	methods: {
		async sendMessage() {
			const route = useRoute()
			if (!this.messageContent) return;

			const { message } = await $fetch(`/api/channels/sendMessage`, { method: 'post', body: { body: this.messageContent, channelId: route.params.id } })

			this.conversation.push(message)
			this.messageContent = '';
			const conversationDiv = document.getElementById('conversation-pane');
			if (!conversationDiv) throw new Error('wtf');
			setTimeout(() => {
				conversationDiv.scrollTop = conversationDiv.scrollHeight;
			})
		},
		// resizeTextarea() {
		// 	const textArea = document.getElementById('messageBox')
		// 	const textBox = document.getElementById('textBox')
		// 	var taLineHeight = 26; // This should match the line-height in the CSS
		// 	var taHeight = textArea.scrollHeight; // Get the scroll height of the textarea
		// 	textArea.style.height = taHeight + 'px'; // This line is optional, I included it so you can more easily count the lines in an expanded textarea
		// 	textBox.style.height = taHeight + 'px'; 
		// 	var numberOfLines = Math.floor(taHeight / taLineHeight);
		// 	console.log("there are " + numberOfLines + " lines in the text area");
		// 	console.log('a')
		// }
	},
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
	background-color: hsl(220, calc(1 * 7.7%), 22.9%);
	bottom: calc(0px - 0.5rem);
}

.message-container {
	transition: backdrop-filter 150ms cubic-bezier(.37, .64, .59, .33);
	margin-top: 0.35rem;
	margin-bottom: 0.35rem;
	padding-left: 1.75rem;
	padding-right: 1.75rem;
	padding-top: 0.5rem;
	padding-bottom: 0.5rem;
}

.message-container:hover {
	backdrop-filter: brightness(1.15);
}

.message-sender-you {
	font-weight: 600;
}
</style>