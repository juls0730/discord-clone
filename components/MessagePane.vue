<template>
	<div class="h-full bg-[hsl(220,calc(1*7.7%),22.9%)] relative text-white">
		<div class="bg-[hsl(220,calc(1*7.7%),22.9%)] absolute w-full shadow px-4 py-3 flex items-center z-[1] shadow-zinc-900/50">
			<span>
				<svg class="text-zinc-300/80 my-auto" xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24">
					<path fill="currentColor"
						d="m5.41 21l.71-4h-4l.35-2h4l1.06-6h-4l.35-2h4l.71-4h2l-.71 4h6l.71-4h2l-.71 4h4l-.35 2h-4l-1.06 6h4l-.35 2h-4l-.71 4h-2l.71-4h-6l-.71 4h-2M9.53 9l-1.06 6h6l1.06-6h-6Z" />
				</svg>
			</span>
			<span class="text-zinc-100 font-semibold">{{ server.name }}</span>
		</div>
		<div class="w-full h-[calc(100%-60px)] overflow-y-scroll pb-1"
			id="conversation-pane">
			<div>
				<div v-if="conversation.length === 0">
					<p>No messages yet</p>
				</div>
				<div v-else
					v-for="message in conversation">
					<div class="message-container">
						<div>
							<div class="message-sender-text">
								<p class="mb-1.5 font-semibold">
									{{ message.creator.username }}
								</p>
								<p class="break-words max-w-full">{{ message.body }}</p>
							</div>
							<div v-for="invite in message.invites">
								<InviteCard :invite="invite" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="conversation-input w-[calc(100vw-88px-240px)] h-[61.1px]">
			<form @submit.prevent="sendMessage"
				@keydown.enter.exact.prevent="sendMessage"
				class="relative px-4 w-full pt-1.5">
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

<script lang="ts">
import { useGlobalStore } from '~/stores/store';
import { io } from 'socket.io-client'
import { IChannel, IInviteCode, IMessage } from '~/types';

export default {
	props: ['server'],
	data() {
		return {
			user: storeToRefs(useGlobalStore()).user,
			messageContent: '',
			conversation: this.server.messages as IMessage[],
			canSendNotifications: false,
			servers: storeToRefs(useGlobalStore()).servers
		}
	},
	mounted() {
		const route = useRoute()
		const socket = io();

		Notification.requestPermission().then((result) => {
			const permission = (result === 'granted') ? true : false
			this.canSendNotifications = permission
		});

		const conversationDiv = document.getElementById('conversation-pane');
		if (!conversationDiv) throw new Error('conversation div not found')
		this.scrollToBottom()

		socket.on(`message-${route.params.id}`, (ev) => {
			const { message } = ev
			if (message.creator.id === this.user.id) return;
			if (!document.hasFocus()) {
				new Notification(`Message from @${message.creator.username}`, { body: message.body, tag: message.serverId });
			}

			this.conversation.push(message)

			const lastElementChild = conversationDiv.children[0]?.lastElementChild
			if (!lastElementChild) return;

			setTimeout(() => {
				if (conversationDiv.scrollTop + 20 < (conversationDiv.scrollHeight - conversationDiv.clientHeight) - lastElementChild.clientHeight) return;
				conversationDiv.scrollTop = conversationDiv.scrollHeight;
			})
		});
	},
	unmounted() {
		const socket = io();
		socket.removeAllListeners();
	},
	methods: {
		async sendMessage() {
			const route = useRoute()
			const headers = useRequestHeaders(['cookie']) as Record<string, string>;
			if (!this.messageContent) return;

			const message: IMessage = await $fetch(`/api/channels/sendMessage`, { method: 'post', body: { body: this.messageContent, channelId: route.params.id }, headers })

			if (!message) return;
			if (this.conversation.includes(message)) return;

			this.conversation.push(message)
			this.messageContent = '';
			const conversationDiv = document.getElementById('conversation-pane');
			if (!conversationDiv) throw new Error('wtf');
			setTimeout(() => {
				conversationDiv.scrollTop = conversationDiv.scrollHeight;
			})
		},
		scrollToBottom() {
			const conversationDiv = document.getElementById('conversation-pane');
			if (!conversationDiv) throw new Error('wtf');
			conversationDiv.scrollTo(0, conversationDiv.scrollHeight);
		}
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