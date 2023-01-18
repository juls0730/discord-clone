<template>
	<div class="absolute right-0 mr-10 -top-[20px] h-fit opacity-0 pointer-events-none action-buttons z-10"
		:class="(emojiPickerOpen) ? 'opacity-100 pointer-events-auto' : ''">
		<div class="absolute right-[38px] top-0 w-[375px]">
			<EmojiPicker v-on:pickedEmoji="pickedEmoji($event)"
				:opened="emojiPickerOpen" />
		</div>
		<div class="relative">
			<div @click="emojiPickerOpen = !emojiPickerOpen"
				class="bg-[hsl(220,calc(1*7.7%),22.9%)] hover:bg-[hsl(220,calc(1*7.7%),28.6%)] transition-colors border border-[rgb(32,34,37)] rounded-md flex text-[hsl(216,3.7%,73.5%)] w-fit h-fit">
				<button class="p-1">
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
			</div>
		</div>
	</div>
	<div class="transition-[backdrop-filter] hover:backdrop-brightness-90 ease-[cubic-bezier(.37,.64,.59,.33)] duration-150 my-4 px-7 py-2 message-wrapper items-center"
		:class="classes">
		<div class="message-content">
			<div class="message-sender-text">
				<p class="mb-1 font-semibold w-fit"
					v-if="showUsername">
					{{ message.creator.username }}
				</p>
				<p class="break-words max-w-full" v-html="message.body"></p>
			</div>
			<div v-for="invite in message.invites">
				<InviteCard :invite="invite" />
			</div>
			<div class="flex gap-2 flex-wrap">
				<button @click="toggleReaction(reaction.emoji.name)"
					v-for="reaction in message.reactions"
					class="py-0.5 px-1.5 bg-[hsl(223,6.9%,19.8%)] border items-center flex rounded-lg border-[hsl(223,6.9%,19.8%)] hover:border-[hsl(223,6.9%,33.3%)] hover:bg-[hsl(223,6.9%,21.3%)] transition-colors shadow-sm max-h-[30px]"
					:class="(reaction.users.find((e) => e.id === user.id)) ? 'border-[rgb(88,101,242)] hover:border-[rgb(88,101,242)]' : ''">
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
</template>

<script lang="ts">
import { PropType } from 'vue';
import { IMessage } from '~/types';
import { useGlobalStore } from '~/stores/store';
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
			if (twemoji === undefined || twemoji.sheet_x  === undefined || twemoji.sheet_y  === undefined) {
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
	}
}
</script>

<style>
.message-wrapper:hover>div.action-buttons {
	opacity: 100;
	pointer-events: all;
}

pre.codeblock {
	background-color: hsl(223, 6.9%, 19.8%);
	border: 1px solid hsl(216, 7.2%, 13.5%);
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
	background-color: hsl(223, 6.9%, 19.8%);
	padding: 0.2rem;
	font-size: 85%;
	border-radius: 4px;
}

</style>