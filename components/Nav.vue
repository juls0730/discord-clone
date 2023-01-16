<template>
	<nav
		class="p-4 bg-[hsl(216,calc(1*7.2%),13.5%)] grid grid-cols-1 grid-rows-[56px_1fr_56px] h-screen min-w-[88px] text-white relative">
		<div>
			<nuxt-link to="/channel/@me">
				<div
					class="bg-zinc-600/80 p-3 rounded-full transition-all hover:rounded-2xl ease-in-out hover:bg-zinc-500/60 duration-300">
					<span>
						<svg width="32"
							height="32"
							viewBox="0 0 24 24">
							<defs>
								<linearGradient id="fire"
									x1="-2.778%"
									x2="100%"
									y1="24%"
									y2="48%">
									<stop offset="0%"
										stop-color="#ff0c41" />
									<stop offset="100%"
										stop-color="#ff6b0c" />
								</linearGradient>
							</defs>
							<path fill="none"
								stroke="url(#fire)"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 12c2-2.96 0-7-1-8c0 3.038-1.773 4.741-3 6c-1.226 1.26-2 3.24-2 5a6 6 0 1 0 12 0c0-1.532-1.056-3.94-2-5c-1.786 3-2.791 3-4 2z" />
						</svg>
					</span>
				</div>
			</nuxt-link>
		</div>
		<div class="overflow-y-scroll my-2 flex gap-y-2 flex-col">
			<nuxt-link v-for="server in servers"
				:to="'/channel/' + server.channels[0]?.id">
				<div :key="server.id"
					class="bg-zinc-600/80 p-3 rounded-full transition-all hover:rounded-2xl ease-in-out hover:bg-zinc-500/60 duration-300 h-[56px] w-[56px]">
					<svg width="32"
						height="32"
						viewBox="0 0 256 154">
						<defs>
							<linearGradient id="svgIDa"
								x1="-2.778%"
								x2="100%"
								y1="32%"
								y2="67.556%">
								<stop offset="0%"
									stop-color="#2298BD" />
								<stop offset="100%"
									stop-color="#0ED7B5" />
							</linearGradient>
						</defs>
						<path fill="url(#svgIDa)"
							d="M128 0C93.867 0 72.533 17.067 64 51.2C76.8 34.133 91.733 27.733 108.8 32c9.737 2.434 16.697 9.499 24.401 17.318C145.751 62.057 160.275 76.8 192 76.8c34.133 0 55.467-17.067 64-51.2c-12.8 17.067-27.733 23.467-44.8 19.2c-9.737-2.434-16.697-9.499-24.401-17.318C174.249 14.743 159.725 0 128 0ZM64 76.8C29.867 76.8 8.533 93.867 0 128c12.8-17.067 27.733-23.467 44.8-19.2c9.737 2.434 16.697 9.499 24.401 17.318C81.751 138.857 96.275 153.6 128 153.6c34.133 0 55.467-17.067 64-51.2c-12.8 17.067-27.733 23.467-44.8 19.2c-9.737-2.434-16.697-9.499-24.401-17.318C110.249 91.543 95.725 76.8 64 76.8Z" />
					</svg>
				</div>
			</nuxt-link>
		</div>
		<div>
			<div @click="createServerModelOpen = true"
				class="bg-zinc-600/80 p-3 rounded-full transition-all hover:rounded-2xl ease-in-out hover:bg-zinc-500/60 duration-300">
				<svg width="32"
					height="32"
					viewBox="0 0 24 24">
					<path fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 5v14m-7-7h14" />
				</svg>
			</div>
		</div>
	</nav>

	<div v-if="createServerModelOpen"
		class="absolute z-10 top-0 bottom-0 left-0 right-0">
		<div
			class="p-4 z-20 absolute bg-zinc-800 shadow-md rounded-md -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 text-white">
			<h2 class="font-semibold text-xl">
				Create a server:
			</h2>
			<div>
				<form @submit.prevent="createServer"
					class="w-3/5">
					<input v-model="serverName"
						type="text"
						class="py-2 px-3 rounded-md mb-2 bg-zinc-700 shadow-md border border-zinc-700/80"
						placeholder="Server name" />
					<input type="submit"
						class="py-2 px-3 rounded-md bg-zinc-700 shadow-md border border-zinc-700/80" />
				</form>
			</div>
		</div>
		<div class="bg-zinc-900/80 w-screen h-screen"
			@click="createServerModelOpen = false">
		</div>
	</div>

</template>

<script lang="ts">
import { useGlobalStore } from '~/stores/store'
import { IServer } from '~/types';

export default {
	data() {
		return {
			servers: storeToRefs(useGlobalStore()).servers,
			createServerModelOpen: false,
			serverName: ''
		}
	},
	methods: {
		async createServer() {
			const globalStore = useGlobalStore();
			const headers = useRequestHeaders(['cookie']) as Record<string, string>;
			const server: IServer = await $fetch('/api/channels/create', { method: 'post', body: { serverName: this.serverName }, headers })
			this.createServerModelOpen = false;
			this.serverName = '';
			globalStore.addServer(server)
		},
	},
}
</script>