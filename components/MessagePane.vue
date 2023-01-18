<template>
	<div class="h-full bg-[hsl(220,calc(1*7.7%),22.9%)] relative text-white">
		<div class="bg-[hsl(220,calc(1*7.7%),22.9%)] absolute w-full shadow px-4 py-3 z-[1] shadow-zinc-900/50">
			<div v-if="!server.DM"
				class="flex items-center">
				<span class="mr-1">
					<svg class="text-zinc-300/80 my-auto"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24">
						<path fill="currentColor"
							d="m5.41 21l.71-4h-4l.35-2h4l1.06-6h-4l.35-2h4l.71-4h2l-.71 4h6l.71-4h2l-.71 4h4l-.35 2h-4l-1.06 6h4l-.35 2h-4l-.71 4h-2l.71-4h-6l-.71 4h-2M9.53 9l-1.06 6h6l1.06-6h-6Z" />
					</svg>
				</span>
				<span class="text-zinc-100 font-semibold">{{ server.name }}</span>
			</div>
			<div v-else
				class="flex items-center">
				<span class="mr-1">
					<svg class="text-zinc-300/80 my-auto"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24">
						<g fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2">
							<circle cx="12"
								cy="12"
								r="4" />
							<path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-5.5 8.28" />
						</g>
					</svg>
				</span>
				<span class="text-zinc-100 font-semibold">{{
					server.dmParticipants?.find((e: SafeUser) => e.id !== user.id)?.username
				}}</span>
			</div>
		</div>
		<div class="w-full h-[calc(100%-76px-48px)] top-[48px] absolute overflow-y-scroll pb-1"
			id="conversation-pane">
			<div>
				<div v-if="server.messages.length === 0">
					<p>No messages yet</p>
				</div>
				<div v-else
					v-for="(message, i) in server.messages" class="relative message-wrapper">
					<Message :message="message"
						:classes="calculateMessageClasses(message, i)"
						:showUsername="i === 0 || server.messages[i - 1]?.creator.id !== message.creator.id" />
				</div>
			</div>
		</div>
		<div v-if="showSearch"
			class="absolute bottom-[calc(75px+0.5rem)] mx-4 w-[calc(100vw-88px-240px-32px)] py-3 px-4 bg-[hsl(223,6.9%,19.8%)] rounded-lg shadow-md z-5">
			<div class="relative flex flex-col">
				<div v-for="user in searchResults"
					class="mx-2 my-1 w-[calc(100vw-88px-240px-64px-16px)] px-4 py-3 hover:bg-[hsl(223,6.9%,24.3%)] select-none rounded-md transition-colors"
					@click="completeMention(user)">
					{{ user.username }}
				</div>
			</div>
		</div>
		<div class="conversation-input w-[calc(100vw-88px-240px)] h-fit">
			<form @keyup="checkForMentions"
				@keypress="typing($event)"
				@submit.prevent="sendMessage"
				@keydown.enter.exact.prevent="sendMessage"
				class="relative px-4 w-full pt-1.5 h-fit pb-1">
				<div id="textbox"
					class="px-4 rounded-md w-full min-h-[44px] h-fit bg-[hsl(218,calc(1*7.9%),27.3%)] placeholder:text-[hsl(218,calc(1*4.6%),46.9%)] flex flex-row">
					<textarea type="text"
						id="messageBox"
						class="bg-transparent focus:outline-none py-2 w-full resize-none leading-relaxed h-[44px]"
						cols="1"
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
				<div class="w-full h-4">
					<p class="text-sm"
						v-if="usersTyping.length > 0">
						<span v-if="usersTyping.length < 4">
							<span v-for="(username, i) in usersTyping"
								class="font-semibold">
								<span v-if="i === usersTyping.length - 1 && usersTyping.length > 1">and </span>
								{{ username }}
								<span v-if="i !== usersTyping.length - 1 && usersTyping.length > 1">, </span>
							</span>
							is typing
						</span>
						<span v-else>Several users are typing</span>
					</p>
				</div>
			</form>
		</div>
	</div>
</template>

<script lang="ts">
import { Server } from 'socket.io';
import { useGlobalStore } from '~/stores/store';
import { IMessage, SafeUser } from '~/types';

export default {
	data() {
		return {
			user: storeToRefs(useGlobalStore()).user,
			server: storeToRefs(useGlobalStore()).activeChannel,
			messageContent: '',
			canSendNotifications: false,
			servers: storeToRefs(useGlobalStore()).servers,
			usersTyping: [] as string[],
			socket: storeToRefs(useGlobalStore()).socket as unknown as Server,
			showSearch: false,
			searchResults: [] as SafeUser[],
			search: '',
		}
	},
	mounted() {
		if (!this.user) throw new Error('User not found, but sessionToken cookie is set')

		Notification.requestPermission().then((result) => {
			const permission = (result === 'granted') ? true : false
			this.canSendNotifications = permission
		});

		const conversationDiv = document.getElementById('conversation-pane');
		if (!conversationDiv) throw new Error('conversation div not found')
		this.scrollToBottom()

		this.listenToWebsocket(conversationDiv)
	},
	methods: {
		async sendMessage() {
			const headers = useRequestHeaders(['cookie']) as Record<string, string>;
			if (!this.messageContent) return;

			let message: IMessage = await $fetch(`/api/channels/sendMessage`, { method: 'post', body: { body: this.messageContent, channelId: this.server.id }, headers })

			if (!message) return;
			if (this.server.messages.includes(message)) return;

			message.body = parseMessageBody(message.body, useGlobalStore().activeChannel)

			this.server.messages.push(message)
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
		},
		typing(event: KeyboardEvent) {
			const specialKeys = [
				"Backspace",
				"Enter",
				"Shift",
				"Control"
			]
			if (specialKeys.indexOf(event.key) !== -1) {
				return
			}

			if (event.ctrlKey) {
				return
			}

			this.socket.emit(`typing`, this.server.id);
		},
		calculateMessageClasses(message: IMessage, i: number) {
			if (i === 0 || this.server.messages[i - 1]?.creator.id !== message.creator.id) {
				if (i !== this.server.messages.length - 1 || this.server.messages[i + 1]?.creator.id === message.creator.id) {
					return 'mb-0 pb-0.5';
				}
			} else {
				if (i !== this.server.messages.length - 1 || this.server.messages[i + 1]?.creator.id === message.creator.id) {
					return 'mt-0 mb-0 py-0.5';
				} else {
					return 'mt-0 pt-0.5 pb-1';
				}
			}

			return '';
		},
		checkForMentions() {
			const input = document.getElementById('messageBox') as HTMLTextAreaElement;
			const startPosition = input.selectionStart;
			const endPosition = input.selectionEnd;

			if (startPosition === endPosition && this.inMention(startPosition)) {
				let participants
				if (this.server.DM) {
					participants = this.server.dmParticipants
				} else {
					participants = this.server.server.participants
				}

				if (!participants) throw new Error(`participants in channel "${this.server.id}" not found"`)

				const search = this.messageContent.split(' ')[this.messageContent.substring(0, startPosition).split(' ').length - 1]?.slice(1);
				if (!search) return

				this.search = search;
				if (this.search.length === 0) {
					this.showSearch = false
					return;
				}

				const maxResults = Math.floor(document.body.clientHeight / 48 + 8) - 6
				let results = participants.filter((e: SafeUser) => e.username.includes(this.search))

				results.sort((a: SafeUser, b: SafeUser) => {
					const usernameA = a.username.toLowerCase();
					const usernameB = b.username.toLowerCase();

					if (usernameA < usernameB) {
						return -1
					} else if (usernameA > usernameB) {
						return 1
					} else {
						return 0
					}
				})

				if (results.length > maxResults) {
					results.length = maxResults
				}

				if (results.length === 0) {
					this.showSearch = false;
					return;
				}
				this.searchResults = results
				this.showSearch = true;
			} else {
				this.showSearch = false
			}
		},
		inMention(cursorPos: number): boolean {
			if (this.messageContent[cursorPos - 1] === '@') return true;
			if (this.messageContent[cursorPos - 1] === ' ') return false;
			if (cursorPos === 0) return false;
			return this.inMention(cursorPos - 1)
		},
		completeMention(user: SafeUser) {
			this.messageContent = this.messageContent.replace('@' + this.search, `<@${user.id}>`)
			this.showSearch = false;
			document.getElementById('messageBox')?.focus()
		},
		listenToWebsocket(conversationDiv: HTMLElement) {
			this.socket.removeAllListeners();

			this.socket.on(`message-${this.server.id}`, (ev: { message: IMessage }) => {
				let { message } = ev

				message.body = parseMessageBody(message.body, useGlobalStore().activeChannel)

				if (this.server.messages.find((e) => e.id === message.id)) {
					// message is already in the server, replace it with the updated message
					console.log(message.id, message.body)
					useGlobalStore().updateMessage(message.id, message)
					console.log('raw', useGlobalStore().activeChannel.messages.find((e) => e.id === message.id)?.body)
					return;
				}

				if (message.creator.id === this.user.id) return;


				if (!document.hasFocus()) {
					new Notification(`Message from @${message.creator.username}`, { body: message.body, tag: this.server.id.toString() });
				}

				this.server.messages.push(message)

				const lastElementChild = conversationDiv.children[0]?.lastElementChild
				if (!lastElementChild) return;

				setTimeout(() => {
					if (conversationDiv.scrollTop + 20 < (conversationDiv.scrollHeight - conversationDiv.clientHeight) - lastElementChild.clientHeight) return;
					conversationDiv.scrollTop = conversationDiv.scrollHeight;
				})
			});

			let timeout: NodeJS.Timeout;
			this.socket.on(`typing-${this.server.id}`, (ev: string) => {
				if (ev === this.user.username) return;
				clearTimeout(timeout)
				timeout = setTimeout(() => {
					this.usersTyping = this.usersTyping.filter(username => username !== ev)
				}, 750);
				if (this.usersTyping.includes(ev)) return;
				this.usersTyping.push(ev);
			})
		},
		// resizeTextarea() {
		// 	const textArea = document.getElementById('messageBox')
		// 	const textBox = document.getElementById('textBox')
		// 	const taLineHeight = 26; // This should match the line-height in the CSS
		// 	const taHeight = textArea.scrollHeight; // Get the scroll height of the textarea
		// 	if (!taHeight) taHeight = 44;
		// 	textArea.style.height = taHeight + 'px'; // This line is optional, I included it so you can more easily count the lines in an expanded textarea
		// 	const numberOfLines = Math.floor(taHeight / taLineHeight);
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
</style>