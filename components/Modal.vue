<script setup lang="ts">
defineEmits(['close']);

defineProps({
	opened: {
		type: Boolean,
		required: true
	}
});
</script>

<template>
  <Teleport to="body">
    <div 
      v-if="opened"
      class="absolute z-10 top-0 bottom-0 left-0 right-0 text-[#fefefe]"
    >
      <slot />
      <div
        class="bg-black/70 w-screen h-screen"
        @click="$emit('close')"
      />
    </div>
  </Teleport>
</template>