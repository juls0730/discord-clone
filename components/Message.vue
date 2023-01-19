<template>
	<div class="relative message-wrapper"
		@mouseenter="mouseEnter()"
		@mouseleave="mouseLeave()">
		<div class="absolute right-0 mr-10 -top-[20px] h-fit opacity-0 pointer-events-none action-buttons z-[5]"
			:class="(emojiPickerOpen) ? 'opacity-100 pointer-events-auto' : ''">
			<div class="absolute top-0 w-[375px]"
				:style="emojiPickerStyles">
				<EmojiPicker v-on:pickedEmoji="pickedEmoji($event)"
					:opened="emojiPickerOpen" />
			</div>
			<div id="actions"
				class="relative bg-[var(--primary-400)] rounded-md border border-[rgb(32,34,37)] text-[var(--primary-text)] flex overflow-hidden">
				<button @click="emojiPickerOpen = !emojiPickerOpen"
					class="p-1 hover:backdrop-brightness-125 transition-all flex w-fit h-fit">
					<svg xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24">
						<path fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m13 19l-1 1l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 0 1 8.003 5.996M14 16h6m-3-3v6" />
					</svg>
				</button>
				<button v-if="!actionButtonOverflowMenuOpen"
					@click="actionButtonOverflowMenuOpen = true"
					class="p-1 hover:backdrop-brightness-125 transition-all flex w-fit h-fit">
					<svg xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24">
						<g fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2">
							<circle cx="5"
								cy="12"
								r="1" />
							<circle cx="12"
								cy="12"
								r="1" />
							<circle cx="19"
								cy="12"
								r="1" />
						</g>
					</svg>
				</button>
				<div @click="actionButtonOverflowMenuOpen = false"
					v-if="actionButtonOverflowMenuOpen"
					class="flex">
					<button @click="copy(message.id)"
						class="p-1 hover:backdrop-brightness-125 transition-all flex text-[var(--primary-400)] w-[28px] h-[28px] items-center justify-center">
						<svg xmlns="http://www.w3.org/2000/svg"
							class="bg-[var(--primary-text)] rounded"
							width="18"
							height="18"
							viewBox="0 0 24 24">
							<path fill="currentColor"
								d="M10 7v2H9v6h1v2H6v-2h1V9H6V7h4m6 0a2 2 0 0 1 2 2v6c0 1.11-.89 2-2 2h-4V7m4 2h-2v6h2V9Z" />
						</svg>
					</button>
					<button v-if="message.creator.id === user.id"
						@click="deleteMessage()"
						class="p-1 hover:backdrop-brightness-125 transition-all flex text-[var(--primary-danger)] w-[28px] h-[28px] items-center justify-center">
						<svg xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24">
							<path fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
						</svg>
					</button>
				</div>
			</div>
		</div>
		<div class="transition-[backdrop-filter] hover:backdrop-brightness-90 ease-[cubic-bezier(.37,.64,.59,.33)] duration-150 my-4 px-7 py-2 message-wrapper items-center z-[1]"
			:class="classes">
			<div class="message-content">
				<div class="message-sender-text">
					<p class="mb-1 font-semibold w-fit"
						v-if="showUsername">
						{{ message.creator.username }}
					</p>
					<p class="break-words max-w-full"
						v-html="message.body"></p>
				</div>
				<div v-for="invite in message.invites">
					<InviteCard :invite="invite" />
				</div>
				<div class="flex gap-2 flex-wrap">
					<button @click="toggleReaction(reaction.emoji.name)"
						v-for="reaction in message.reactions"
						class="py-0.5 px-1.5 bg-[var(--primary-500)] border items-center flex rounded-lg border-[var(--primary-500)] hover:border-[var(--reaction-border)] hover:bg-[var(--reaction-hover)] transition-colors shadow-sm max-h-[30px]"
						:class="(reaction.users.find((e) => e.id === user.id)) ? '!border-[rgb(88,101,242)] hover:!border-[rgb(88,101,242)]' : ''">
						<div class="flex items-center mr-0.5 w-6 drop-shadow">
							<span :style="emojiStyles(reaction.emoji.name, 16)"></span>
						</div>
						<div class="relative overflow-hidden ml-1.5">
							<div class="min-w-[9px]  h-6"
								:key="reaction.count">
								<span class="dropshadow-sm">{{ reaction.count }}</span>
							</div>
						</div>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { IMessage } from '~/types';
import { useGlobalStore } from '~/stores/store';
import { useClipboard } from '@vueuse/core'
import emojiJson from '~/assets/json/emoji.json';

export default {
	props: {
		message: {
			type: Object as PropType<IMessage>,
			required: true
		},
		showUsername: {
			type: Boolean,
			required: true
		},
		classes: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			user: storeToRefs(useGlobalStore()).user,
			emojiPickerOpen: false,
			emojiPickerStyles: this.calculateEmojiPickerRight(),
			actionButtonOverflowMenuOpen: false,
		}
	},
	setup() {
		const { text, copy, copied, isSupported } = useClipboard()

		return {
			copy
		}
	},
	methods: {
		async toggleReaction(emoji: string) {
			const route = useRoute()
			let { message } = await $fetch(`/api/channels/${route.params.id}/messages/${this.message.id}/reactions/${emoji}`, { method: "POST" }) as { message: IMessage }

			message.body = parseMessageBody(message.body, useGlobalStore().activeChannel)

			useGlobalStore().updateMessage(this.message.id, message)
		},
		emojiStyles(emoji: string, width: number) {
			const emojis = emojiJson.filter((e) => e.has_img_twitter)
			const twemoji = emojis.find((e) => e.emoji === emoji)
			if (twemoji === undefined || twemoji.sheet_x === undefined || twemoji.sheet_y === undefined) {
				return {};
			}
			const sheet_x = (twemoji.sheet_y * (32 + 2)) / 2;
			const sheet_y = (twemoji.sheet_x * (32 + 2)) / 2;
			return {
				background: 'url(/32.png)',
				width: `${width + 1}px`,
				height: `${width + 1}px`,
				display: 'inline-block',
				'background-position': `-${sheet_y}px -${sheet_x}px`,
				'background-size': '1037px 1037px'
			}
		},
		pickedEmoji(emoji: string) {
			const replacementEmoji = emojiJson.find((e) => e.short_name === emoji);
			if (!replacementEmoji?.emoji) return;
			if (this.message.reactions?.find((e) => e.emoji.name === replacementEmoji.emoji)) return
			this.toggleReaction(replacementEmoji.emoji)
			this.emojiPickerOpen = false;
		},
		async deleteMessage() {
			const route = useRoute()
			await $fetch(`/api/channels/${route.params.id}/messages/${this.message.id}/delete`, { method: "POST" })
		},
		calculateEmojiPickerRight() {
			const actions = document.getElementById('actions')
			if (!actions) return {}
			const right = actions.clientWidth + 8
			return {
				right: right + 'px'
			}
		},
		keyPressed(ev: KeyboardEvent) {
			if (ev.key === 'Shift') {
				this.actionButtonOverflowMenuOpen = true
			}
		},
		keyUnpressed(ev: KeyboardEvent) {
			if (ev.key === 'Shift') {
				this.actionButtonOverflowMenuOpen = false
			}
		},
		mouseEnter() {
			document.body.addEventListener('keydown', this.keyPressed, false);
			document.body.addEventListener('keyup', this.keyUnpressed, false);
		},
		mouseLeave() {
			this.actionButtonOverflowMenuOpen = false
			document.body.removeEventListener('keydown', this.keyPressed, false)
			document.body.removeEventListener('keyup', this.keyUnpressed, false)
		}
	}
}
</script>

<style>
.message-wrapper:hover>div.action-buttons {
	opacity: 100;
	pointer-events: all;
}

pre.codeblock {
	background-color: var(--primary-500);
	border: 1px solid var(--primary-700);
	border-radius: 0.375rem;
	white-space: prewrap;
	margin-top: 4px;
	margin-bottom: 0;
	display: flex;
	overflow-x: scroll;
	padding: 0.5rem;
	line-height: 1.125rem;
}

pre.codeblock code {
	width: 100%;
	display: flex;
	flex-direction: column;
}

code.inline-code {
	background-color: var(--primary-500);
	padding: 0.2rem;
	font-size: 85%;
	border-radius: 4px;
}
</style>