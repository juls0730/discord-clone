<template>
	<div class="flex bg-[hsl(223,calc(1*6.9%),19.8%)] min-w-60 w-60 h-screen shadow-sm text-white select-none">
		<div v-if="!server.id || server.DM == true">
			<div>
				<nuxt-link v-for="dm in user.channels" :to="'/channel/@me/' + dm.id">
					<div class="mx-2 my-4 hover:bg-[hsl(223,calc(1*6.9%),25.8%)] px-2 py-2 w-[calc(240px-1rem)] max-h-10 h-10 overflow-ellipsis rounded-md transition-colors">
						{{ (dm.name).split('-').filter((e: string) => e !== user.id)[0] }}
					</div>
				</nuxt-link>
			</div>
		</div>
		<div class="w-full"
			v-else>
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
export default {
	props: ['server', 'user']
}
</script>