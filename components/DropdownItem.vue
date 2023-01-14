<template>
	<li>
		<button
			class="w-full cursor-pointer bg-[hsl(225,7.7%,10.2%)] hover:bg-[hsl(225,7.7%,17.4%)] text-left px-3 py-1.5 rounded-md flex items-center justify-between transition-colors"
			:class="(danger) ? 'hover:bg-[hsl(359,66.7%,54.1%)]' : ''">
			<slot />
		</button>
	</li>
</template>

<script>
export default {
	props: ['danger']
}
</script>