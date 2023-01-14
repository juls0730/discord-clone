<template>
	<Transition name="pop-in">
		<div ref="dropdown" class="z-[2] absolute m-2 bg-[hsl(225,7.7%,10.2%)] w-[calc(100%-1rem)] p-3 rounded text-left"
		:class="(inverted) ? 'dropdown-inverse' : 'dropdown'"
			v-if="opened">
			<slot />
		</div>
	</Transition>
</template>

<script lang="ts">
export default {
	props: ['opened', 'inverted'],
}
</script>

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
		transform: scale(0);
	}

	100% {
		transform: scale(1);
	}
}
</style>