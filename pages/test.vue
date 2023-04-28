<template>
  <div class="bg-[var(--primary-bg)] h-full">
    <Popup
      :opened="true"
      :openedBy="'userInfo'"
    />
    <Popup
      :opened="true"
      :openedBy="'emojiPicker'"
    />
  </div>
</template>

<script lang="ts">
import { useEmojiPickerStore } from '~/stores/emojiPickerStore';

export default {
	data() {
		return {
			emojiPickerData: storeToRefs(useEmojiPickerStore()).emojiPickerData,
			emojiPickerStyles: {
				top: storeToRefs(useEmojiPickerStore()).emojiPickerData.value.top + 'px',
				right: storeToRefs(useEmojiPickerStore()).emojiPickerData.value.right + 'px',
			}
		};
	},
	mounted() {
		useEmojiPickerStore().openEmojiPicker({ opened: true, type: 'userInfo', right: 0, top: 0 });
	}
};
</script>