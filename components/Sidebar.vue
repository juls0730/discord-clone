<template>
	<div class="flex bg-[hsl(223,calc(1*6.9%),19.8%)] min-w-60 w-60 h-screen shadow-sm text-white select-none">
		<div class="w-full"
			v-if="server">
			<div class="flex p-4 border-b border-zinc-600/80">
				<h4 class="text-lg font-semibold w-fit ">
					{{ server.name }}
				</h4>
			</div>
			<div class="flex gap-y-1.5 px-1.5 mt-2 flex-col">
				<div class="flex text-center hover:bg-zinc-600/70 px-2 py-1.5 w-full transition-colors rounded drop-shadow-sm"
					v-for="channel in server.channels"
					:key="channel.id">
					<svg width="24"
						height="24"
						viewBox="0 0 24 24">
						<path fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 9h14M5 15h14M11 4L7 20M17 4l-4 16" />
					</svg> {{ channel.name }}
				</div>
			</div>
		</div>

	</div>
</template>

<script lang="ts">
import { useServerStore } from '~/stores/servers'

export default {
	mounted() {
		console.log(useServerStore().currentServer, useServerStore().servers)
	},
	props: ['server', 'user']
}
</script>