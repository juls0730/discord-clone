<template>
	<li>
		<button
			class="w-full cursor-pointer bg-inherit hover:backdrop-brightness-150 text-left px-3 py-1.5 rounded-md flex items-center justify-between transition-all"
			:class="(danger) ? 'hover:bg-[var(--primary-danger)]' : ''">
			<slot />
		</button>
	</li>
</template>

<script>
export default {
	props: ['danger']
}
</script>