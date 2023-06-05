<!-- eslint-disable vue/no-multiple-template-root -->
<script lang="ts" setup>
import { useActiveStore } from '~/stores/activeStore';
import { useEmojiPickerStore } from '~/stores/emojiPickerStore';
import { useServerStore } from '~/stores/serverStore';
import { IChannel, IServer } from '~/types';
import { onMounted } from 'vue';

definePageMeta({
	middleware: 'auth'
});

const route = useRoute();
const emojiPickerData = storeToRefs(useEmojiPickerStore()).emojiPickerData;

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

const server = useActiveStore().server;

useHeadSafe({
	title: `#${server.channel.name} | ${server.server.name} - Blop`
});

function pickedEmoji(emoji: string) {
	const { $emit } = useNuxtApp();
	$emit('pickedEmoji', emoji);
	useEmojiPickerStore().closeEmojiPicker();
}

onMounted(async () => {
	const { $io } = useNuxtApp();

	(await $io).on(`addChannel-${server.server.id}`, (ev) => {
		const newChannel = ev as IChannel;
		useServerStore().addChannel(server.server.id, newChannel);
	});
});
</script>

<template>
  <MessagePane
    :channel="server.channel"
    :participants="server.server.participants"
  />
  <div
    class="fixed mx-3"
    :style="`top: ${emojiPickerData.top}px; ${(emojiPickerData.right !== undefined) ? `right: ${emojiPickerData.right}px;` : `left: ${emojiPickerData.left}px`}`"
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