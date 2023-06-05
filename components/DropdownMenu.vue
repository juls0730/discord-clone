<script lang="ts" setup>
defineProps({
	opened: {
		type: Boolean,
		required: true
	},
	inverted: {
		type: Boolean,
		default: false
	}
});
</script>

<template>
  <Transition name="pop-in">
    <div
      v-if="opened"
      ref="dropdown"
      class="z-[2] absolute m-2 bg-[var(--tertiary-bg)] w-[calc(100%-1rem)] p-3 rounded text-left"
      :class="(inverted) ? 'dropdown-inverse' : 'dropdown'"
    >
      <slot />
    </div>
  </Transition>
</template>

<style>
.dropdown {
	transform-origin: top center;
}

.dropdown-inverse {
	transform-origin: bottom center;
}

.dropdown-inverse > div > ul {
	flex-direction: column-reverse;
}

.pop-in-enter-active {
	animation: pop-in 150ms cubic-bezier(.81, .5, .44, .83);
}

.pop-in-leave-active {
	animation: pop-in 150ms reverse cubic-bezier(.81, .5, .44, .83);
}

@keyframes pop-in {
	0% {
		transform: scale(0.7);
		opacity: 0;
	}

	100% {
		transform: scale(1);
		opacity: 1;
	}
}
</style>