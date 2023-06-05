<script lang="ts" setup>
import { PropType } from 'vue';

defineProps({
	openedBy: {
		type: String as PropType<'emojiPicker' | 'userProfile'>,
		required: true
	},
	opened: Boolean
});

defineEmits(['picked-emoji']);
</script>

<template>
  <div
    v-if="opened"
    class="z-10 bg-[var(--secondary-bg)] w-fit rounded-lg shadow-md border border-[var(--tertiary-bg)] overflow-hidden"
  >
    <div class="max-w-[374px] max-h-[475px] overflow-hidden">
      <EmojiPicker
        v-if="openedBy === 'emojiPicker'"
        @picked-emoji="$emit('picked-emoji', $event)"
      />
      <UserProfile
        v-else
      />
    </div>
  </div>
</template>