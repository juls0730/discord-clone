<template>
  <div
    class="h-full relative bg-[var(--primary-bg)] flex flex-col"
    @mouseenter="mouseEnter"
    @mouseleave="mouseLeave"
  >
    <div class="px-4 py-3">
      <div
        v-if="!channel.DM"
        class="flex items-center"
      >
        <span class="mr-1">
          <svg
            class="text-zinc-300/80 my-auto"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m5.41 21l.71-4h-4l.35-2h4l1.06-6h-4l.35-2h4l.71-4h2l-.71 4h6l.71-4h2l-.71 4h4l-.35 2h-4l-1.06 6h4l-.35 2h-4l-.71 4h-2l.71-4h-6l-.71 4h-2M9.53 9l-1.06 6h6l1.06-6h-6Z"
            />
          </svg>
        </span>
        <span class="font-semibold">{{ channel.name }}</span>
      </div>
      <div
        v-else
        class="flex items-center"
      >
        <span class="mr-1">
          <svg
            class="text-zinc-300/80 my-auto"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            >
              <circle
                cx="12"
                cy="12"
                r="4"
              />
              <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-5.5 8.28" />
            </g>
          </svg>
        </span>
        <span class="font-semibold">{{
          participants.find((e: SafeUser) => e.id !== user?.id)?.username
        }}</span>
      </div>
    </div>

    <section
      class="h-full overflow-hidden rounded-lg relative flex flex-col"
    >
      <div
        ref="conversationPane"
        class="h-[calc(100%-70px)] overflow-y-scroll"
      >
        <div class="w-full pb-1 bg-inherit">
          <div>
            <div v-if="channel.messages.length === 0">
              <p>No messages yet</p>
            </div>
            <Message
              v-for="(message, i) in channel.messages"
              v-else
              :key="message.id"
              :message="message"
              :shift-pressed="shiftPressed"
              :show-username="i === 0 || channel.messages[i - 1]?.creator.id !== message.creator.id"
              :classes="calculateMessageClasses(message, i)"
              :channel-id="channel.id"
              :participants="participants"
            />
          </div>
        </div>
        <div
          v-if="search.show"
          class="absolute bottom-[calc(75px+0.5rem)] mx-4 w-[calc(100vw-88px-240px-32px)] py-3 px-4 bg-[var(--secondary-bg)] rounded-lg shadow-md z-5"
        >
          <div class="relative flex flex-col">
            <div
              v-for="resultingUser in search.results"
              :key="resultingUser.id"
              class="mx-2 my-1 w-[calc(100vw-88px-240px-64px-16px)] px-4 py-3 hover:backdrop-brightness-125 select-none rounded-md transition-all"
              @click="completeMention(resultingUser)"
            >
              {{ resultingUser.username }}
            </div>
          </div>
        </div>
      </div>

      <div class="flex absolute flex-row bottom-0 w-full h-fit bg-inherit">
        <form
          class="relative px-4 w-full pt-1.5 h-fit pb-1"
          @keyup="checkForMentions"
          @keypress="typing($event)"
          @submit.prevent="sendMessage"
          @keydown.enter.exact.prevent="sendMessage"
        >
          <div
            id="textbox"
            class="px-4 rounded-md w-full min-h-[44px] h-fit bg-[var(--secondary-bg)] placeholder:text-[var(--primary-placeholder)] flex flex-row"
          >
            <textarea
              ref="messageBox"
              v-model="messageContent"
              maxlength="5000"
              type="text"
              class="bg-transparent focus:outline-none py-2 w-full resize-none leading-relaxed h-[44px]"
              cols="1"
              placeholder="Send a Message..."
            />
            <input
              id="submit"
              type="submit"
              class="absolute -top-full -left-full invisible"
            >
            <label
              for="submit"
              class="py-1 px-1.5 h-fit my-auto cursor-pointer"
              role="button"
            ><svg
              width="32"
              height="26"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14L21 3m0 0l-6.5 18a.55.55 0 0 1-1 0L10 14l-7-3.5a.55.55 0 0 1 0-1L21 3"
              />
            </svg></label>
          </div>
          <div class="w-full h-4">
            <p
              v-if="usersTyping.length > 0"
              class="text-sm"
            >
              <span v-if="usersTyping.length < 4">
                <span
                  v-for="(username, i) in usersTyping"
                  :key="username"
                  class="font-semibold"
                >
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
    </section>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { useActiveStore } from '~/stores/activeStore';
import { useUserStore } from '~/stores/userStore';
import { IChannel, IMessage, SafeUser } from '~/types';

export default {
	props: {
		channel: {
			type: Object as PropType<IChannel>,
			required: true
		},
		participants: {
			type: Array as PropType<SafeUser[]>,
			required: true
		}
	},
	data() {
		return {
			user: storeToRefs(useUserStore()).user,
			messageContent: '',
			shiftPressed: false,
			usersTyping: [] as string[],
			search: {
				content: '',
				show: false,
				results: [] as SafeUser[],
			}
		};
	},
	mounted() {
		Notification.requestPermission();

		const conversationDiv = this.$refs.conversationPane as HTMLDivElement;
		if (!conversationDiv) throw new Error('conversation div not found');
		this.scrollToBottom();

		this.listenToWebsocket(conversationDiv);
	},
	methods: {
		async sendMessage() {
			const headers = useRequestHeaders(['cookie']) as Record<string, string>;
			if (!this.messageContent) return;

			let message: IMessage = await $fetch(`/api/channels/${this.channel.id}/sendMessage`, { method: 'post', body: { body: this.messageContent }, headers });

			if (!message) return;
			if (this.channel.messages.includes(message)) return;

			message.body = parseMessageBody(message.body, this.participants);

			this.channel.messages.push(message);
			this.messageContent = '';
			const conversationDiv = this.$refs.conversationPane as HTMLDivElement;
			if (!conversationDiv) throw new Error('wtf');

			this.scrollToBottom();
		},
		scrollToBottom() {
			const conversationDiv = this.$refs.conversationPane as HTMLDivElement;
			if (!conversationDiv) throw new Error('wtf');
			conversationDiv.scrollTo(0, conversationDiv.scrollHeight);
		},
		typing(event: KeyboardEvent) {
			const { $io } = useNuxtApp();

			const specialKeys = [
				'Backspace',
				'Enter',
				'Shift',
				'Control'
			];
			if (specialKeys.indexOf(event.key) !== -1) {
				return;
			}

			if (event.ctrlKey) {
				return;
			}

			$io.emit('typing', this.channel.id);
		},
		mouseEnter() {
			document.body.addEventListener('keydown', this.keyPressed, false);
			document.body.addEventListener('keyup', this.keyUnpressed, false);
		},
		mouseLeave() {
			this.shiftPressed = false;
			document.body.removeEventListener('keydown', this.keyPressed, false);
			document.body.removeEventListener('keyup', this.keyUnpressed, false);
		},
		keyPressed(ev: KeyboardEvent) {
			if (ev.key === 'Shift') {
				this.shiftPressed = true;
			}
		},
		keyUnpressed(ev: KeyboardEvent) {
			if (ev.key === 'Shift') {
				this.shiftPressed = false;
			}
		},
		calculateMessageClasses(message: IMessage, i: number) {
			if (i === 0 || this.channel.messages[i - 1]?.creator.id !== message.creator.id) {
				if (i !== this.channel.messages.length - 1 || this.channel.messages[i + 1]?.creator.id === message.creator.id) {
					return 'mb-0 pb-0.5';
				}
			} else {
				if (i !== this.channel.messages.length - 1 || this.channel.messages[i + 1]?.creator.id === message.creator.id) {
					return 'mt-0 mb-0 !py-0.5';
				} else {
					return 'mt-0 pt-0.5 pb-1';
				}
			}

			return '';
		},
		checkForMentions() {
			const input = this.$refs.messageBox as HTMLTextAreaElement;
			const startPosition = input.selectionStart;
			const endPosition = input.selectionEnd;

			if (startPosition === endPosition && this.inMention(startPosition)) {
				const search = this.messageContent.split(' ')[this.messageContent.substring(0, startPosition).split(' ').length - 1]?.slice(1);
				if (!search) return;

				this.search.content = search;
				if (this.search.content.length === 0) {
					this.search.show = false;
					return;
				}

				const maxResults = Math.floor(document.body.clientHeight / 48 + 8) - 6;
				let results = this.participants.filter((e: SafeUser) => e.username.includes(this.search.content));

				results.sort((a: SafeUser, b: SafeUser) => {
					const usernameA = a.username.toLowerCase();
					const usernameB = b.username.toLowerCase();

					if (usernameA < usernameB) {
						return -1;
					} else if (usernameA > usernameB) {
						return 1;
					} else {
						return 0;
					}
				});

				if (results.length > maxResults) {
					results.length = maxResults;
				}

				if (results.length === 0) {
					this.search.show = false;
					return;
				}
				this.search.results = results;
				this.search.show = true;
			} else {
				this.search.show = false;
			}
		},
		inMention(cursorPos: number): boolean {
			if (this.messageContent[cursorPos - 1] === '@') return true;
			if (this.messageContent[cursorPos - 1] === ' ') return false;
			if (cursorPos === 0) return false;
			return this.inMention(cursorPos - 1);
		},
		completeMention(user: SafeUser) {
			this.messageContent = this.messageContent.replace('@' + this.search.content, `<@${user.id}>`);
			this.search.show = false;
			this.$refs.messageBox.focus();
		},
		listenToWebsocket(conversationDiv: HTMLElement) {
			const { $io } = useNuxtApp();

			$io.removeAllListeners();

			$io.on(`message-${this.channel.id}`, (ev: { message: IMessage, deleted?: boolean }) => {
				let { message, deleted } = ev;
				
				if (deleted) {
					useActiveStore().removeMessage(message.id);
					return;
				}

				message.body = parseMessageBody(message.body, this.participants);

				if (this.channel.messages.find((e) => e.id === message.id)) {
					// message is already in the server, replace it with the updated message
					useActiveStore().updateMessage(message);
					return;
				}

				if (message.creator.id === this.user?.id) return;


				if (!document.hasFocus()) {
					new Notification(`Message from @${message.creator.username}`, { body: message.body, tag: this.channel.id.toString() });
				}

				useActiveStore().addMessage(message);

				const lastElementChild = conversationDiv.children[0]?.lastElementChild;
				if (!lastElementChild) return;

				setTimeout(() => {
					if (conversationDiv.scrollTop + 20 < (conversationDiv.scrollHeight - conversationDiv.clientHeight) - lastElementChild.clientHeight) return;
					conversationDiv.scrollTop = conversationDiv.scrollHeight;
				});
			});

			let timeout: NodeJS.Timeout;
			$io.on(`typing-${this.channel.id}`, (ev: string) => {
				if (ev === this.user?.username) return;
				clearTimeout(timeout);
				timeout = setTimeout(() => {
					this.usersTyping = this.usersTyping.filter(username => username !== ev);
				}, 750);
				if (this.usersTyping.includes(ev)) return;
				this.usersTyping.push(ev);
			});
		},
	},
};

</script>