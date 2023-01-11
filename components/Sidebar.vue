<template>
	<div
		class="bg-[hsl(223,calc(1*6.9%),19.8%)] min-w-60 w-60 h-screen shadow-sm text-white select-none grid grid-rows-[93.5%_1fr]">
		<div v-if="!server.id || server.DM == true">
			<div>
				<nuxt-link v-for="dm in user.channels"
					:to="'/channel/@me/' + dm.id">
					<div
						class="mx-2 my-4 hover:bg-[hsl(223,calc(1*6.9%),25.8%)] px-2 py-2 w-[calc(240px-1rem)] max-h-10 h-10 overflow-ellipsis rounded-md transition-colors">
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

		<div>
			<div class="bg-[hsl(220,calc(1*6.8%),17.3%)] h-full p-3">
				<div class="grid grid-cols-[32px_1fr_32px] gap-x-2 items-center">
					<span class="bg-[hsl(220,calc(1*6.8%),22.6%)] w-[32px] h-[32px] rounded-full"></span>
					<span class="h-fit w-fit overflow-ellipsis">{{ user.username }}</span>
					<span class="text-zinc-300 hover:bg-[hsl(220,calc(1*6.8%),14.3%)] p-1 transition-colors">
						<svg xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24">
							<g fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2">
								<path
									d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37c1 .608 2.296.07 2.572-1.065z" />
								<circle cx="12"
									cy="12"
									r="3" />
							</g>
						</svg>
					</span>
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