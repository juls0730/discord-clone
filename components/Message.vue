<template>
	<div class="message-content">
		<div
			class="absolute right-0 mr-10 -top-[15px] h-fit opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto">
			<div class="relative">
				<div
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
		<div class="message-sender-text">
			<p class="mb-1 font-semibold w-fit"
				v-if="showUsername">
				{{ message.creator.username }}
			</p>
			<p class="break-words max-w-full">{{ message.body }}</p>
		</div>
		<div v-for="invite in message.invites">
			<InviteCard :invite="invite" />
		</div>
		<div class="flex gap-2">
			<button @click="toggleReaction(message.id, reaction.emoji.name)"
				v-for="reaction in message.reactions"
				class="py-0.5 px-1.5 bg-[hsl(223,6.9%,19.8%)] border items-center flex rounded-lg border-[hsl(223,6.9%,19.8%)] hover:border-[hsl(223,6.9%,33.3%)] hover:bg-[hsl(223,6.9%,21.3%)] transition-colors shadow-sm max-h-[30px]"
				:class="(reaction.users.find((e) => e.id === user.id)) ? 'border-[rgb(88,101,242)] hover:border-[rgb(88,101,242)]' : ''">
				<div class="flex items-center mr-0.5 w-4 drop-shadow"
					v-html="twemoji(reaction.emoji.name)">

				</div>
				<div class="relative overflow-hidden ml-1.5">
					<div class="min-w-[9px]  h-6"
						:key="reaction.count">
						<span>{{ reaction.count }}</span>
					</div>
				</div>
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { IMessage } from '~/types';
import { useGlobalStore } from '~/stores/store';
import twemoji from 'twemoji'

export default {
	props: {
		message: {
			type: Object as PropType<IMessage>,
			required: true
		},
		showUsername: {
			type: Boolean,
			required: true
		}
	},
	data() {
		return {
			user: storeToRefs(useGlobalStore()).user,
		}
	},
	methods: {
		async toggleReaction(messageId: string, emoji: string) {
			const route = useRoute()
			const { message } = await $fetch(`/api/channels/${route.params.id}/messages/${messageId}/reactions/${emoji}`, { method: "POST" }) as IMessage
			console.log(message)
			useGlobalStore().updateMessage(messageId, message)
		},
		twemoji(emoji: string) {
			return twemoji.parse(emoji, { base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/' })
		},
	}
}
</script>