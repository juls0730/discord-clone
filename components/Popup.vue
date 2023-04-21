<template>
  <div
    v-if="opened"
    class="z-10 bg-[var(--primary-dark)] w-fit rounded-md shadow-md p-3"
  >
    <div class="max-w-[350px] max-h-[450px] overflow-hidden">
      <EmojiPicker
        v-if="openedBy === 'emojiPicker'"
        @picked-emoji="$emit('picked-emoji', $event)"
      />
    </div>
  </div>
</template>

<script>
export default {
	props: {
		openedBy: {
			type: String,
			required: true
		},
		opened: Boolean
	}
};
</script>