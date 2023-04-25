<!-- eslint-disable vue/no-multiple-template-root -->
<template>
  <MessagePane
    :channel="channel"
    :participants="server.participants"
  />
  <div
    class="fixed mr-3"
    :style="`top: ${emojiPickerData.top}px; right: ${emojiPickerData.right}px`"
  >
    <Transition>
      <Popup
        :opened="emojiPickerData.opened"
        :openedBy="emojiPickerData.type"
        @pickedEmoji="pickedEmoji($event)"
      />
    </Transition>
  </div>
</template>

<script lang="ts">
import { useActiveStore } from '~/stores/activeStore';
import { useEmojiPickerStore } from '~/stores/emojiPickerStore';
import { useServerStore } from '~/stores/serverStore';
import { IChannel, IMessage, IServer } from '~/types';

definePageMeta({
	middleware: 'auth'
});

export default {
	async setup() {
		const route = useRoute();

		if (useServerStore().servers.find((e) => { return e.channels.some((e) => e.id === route.params.channelId); } ) == undefined) navigateTo('/');
		if (useActiveStore().server.channel.id !== route.params.channelId) {
			const headers = useRequestHeaders(['cookie']) as Record<string, string>;
			const [channel, server] = await Promise.all([
				await $fetch(`/api/channels/${route.params.channelId}`, { headers }) as IChannel,
				await $fetch(`/api/channels/${route.params.channelId}/guild`, { headers }) as IServer,
			]);

			if (!server) throw new Error('server not found, this means that the channel is serverless but not a dm????');
			useServerStore().addServer(server);

			if (typeof route.params.channelId !== 'string') throw new Error('route.params.id must be a string, but got an array presumably?');
			useActiveStore().setActiveServer(channel, useServerStore().servers);
			useEmojiPickerStore().closeEmojiPicker();
		}
		useEmojiPickerStore().closeEmojiPicker();

		const channel = useActiveStore().server.channel;
		const server = useActiveStore().server.server;

		channel.messages?.forEach((e: IMessage) => {
			e.body = parseMessageBody(e.body, server.participants);
		});

		useHeadSafe({
			title: `#${channel.name} | ${server.name} - Blop`
		});

		return {
			channel,
			server
		};
	},
	data() {
		return {
			// socket: storeToRefs(useGlobalStore()).socket as unknown as Server,
			emojiPickerData: storeToRefs(useEmojiPickerStore()).emojiPickerData,
			emojiPickerStyles: {
				top: storeToRefs(useEmojiPickerStore()).emojiPickerData.value.top + 'px',
				right: storeToRefs(useEmojiPickerStore()).emojiPickerData.value.right + 'px',
			}
		};
	},
	async mounted() {
		const { $io } = useNuxtApp();

		(await $io).on(`addChannel-${this.server.id}`, (ev) => {
			const newChannel = ev as IChannel;
			useServerStore().addChannel(this.server.id, newChannel);
		});
	},
	methods: {
		pickedEmoji(emoji: string) {
			const { $emit } = useNuxtApp();
			$emit('pickedEmoji', emoji);
			useEmojiPickerStore().closeEmojiPicker();
		},
	}
};
</script>