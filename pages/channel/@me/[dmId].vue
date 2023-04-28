<!-- eslint-disable vue/no-multiple-template-root -->
<template>
  <MessagePane
    :channel="channel"
    :participants="participants"
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

<script lang="ts">
import { useActiveStore } from '~/stores/activeStore';
import { useDmStore } from '~/stores/dmStore';
import { useEmojiPickerStore } from '~/stores/emojiPickerStore';
import { useUserStore } from '~/stores/userStore';
import { IChannel, IMessage, SafeUser } from '~/types';

definePageMeta({
	middleware: 'auth'
});

export default {
	async setup() {
		const route = useRoute();
		
		if (useDmStore().dms.find((e) => { return e.id === route.params.dmId; } ) == undefined) navigateTo('/');
		if (useActiveStore().server.channel.id !== route.params.dmId) {
			const headers = useRequestHeaders(['cookie']) as Record<string, string>;
			const dm: IChannel = await $fetch(`/api/channels/${route.params.dmId}`, { headers });

			if (!dm) throw new Error('couldnt find dm.');
			useDmStore().addDM(dm);

			if (typeof route.params.dmId !== 'string') throw new Error('route.params.dmId must be a string, but got an array presumably?');
			useActiveStore().setActiveDM(dm);
			useEmojiPickerStore().closeEmojiPicker();
		}

		const participants: SafeUser[] | undefined = useActiveStore().dm.dmParticipants;

		if (!participants) throw new Error('no one is in this dm?');

		const channel = useActiveStore().dm;

		const friend = participants.find((e) => e.id !== useUserStore().user?.id)?.username;

		useHeadSafe({
			title: `@${friend} - Blop`
		});

		return {
			channel,
			participants
		};
	},
	data() {
		return {
			emojiPickerData: storeToRefs(useEmojiPickerStore()).emojiPickerData,
		};
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