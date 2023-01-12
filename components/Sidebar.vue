<template>
	<div
		class="bg-[hsl(223,calc(1*6.9%),19.8%)] min-w-60 w-60 h-screen shadow-sm text-white select-none grid grid-rows-[93.5%_1fr]">
		<div v-if="!server.id || server.DM == true">
			<div>
				<nuxt-link v-for="dm in dms"
					:to="'/channel/@me/' + dm.id">
					<div
						class="mx-2 my-4 hover:bg-[hsl(223,calc(1*6.9%),25.8%)] px-2 py-2 w-[calc(240px-1rem)] max-h-10 h-10 overflow-ellipsis rounded-md transition-colors">
						{{ (dm.name).split('-').find((e: string) => e !== user.id) }}
					</div>
				</nuxt-link>
			</div>
		</div>
		<div class="w-full"
			v-else>
			<div class="flex p-4 border-b border-zinc-600/80">
				<h4 class="text-lg font-semibold grid gap-1 grid-cols-[1fr_28px] w-full">
					<span>{{ server.name }}</span>
					<button class="cursor-pointer p-1 bg-[hsl(223,calc(1*6.9%),19.8%)] hover:bg-[hsl(223,calc(1*6.9%),26.4%)] transition-all">
						<span class="h-fit w-[20px]">
							<svg xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24">
								<path fill="none"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="m6 9l6 6l6-6" />
							</svg>
						</span>
					</button>
				</h4>
			</div>
			<div class="flex gap-y-1.5 px-1.5 mt-2 flex-col">
				<button @click="createInvite"
					v-if="userIsOwner || userIsAdmin">make invite</button>
				<button
					class="flex text-center hover:bg-[hsl(223,calc(1*6.9%),26.4%)] px-2 py-1.5 w-full transition-colors rounded drop-shadow-sm gap-1/5 cursor-pointer"
					v-for="channel in server.channels"
					@click="openChannel(channel.id)"
					:key="channel.id">
					<span>
						<svg class="text-zinc-300 my-auto"
							width="20"
							height="20"
							viewBox="0 0 24 24">
							<path fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 9h14M5 15h14M11 4L7 20M17 4l-4 16" />
						</svg>
					</span>
					<span>{{ channel.name }}</span>
				</button>
				<button v-if="userIsOwner || userIsAdmin"
					@click="openCreateChannelModel"
					class="flex text-center hover:bg-[hsl(223,calc(1*6.9%),26.4%)] px-2 py-1.5 w-full transition-colors rounded drop-shadow-sm cursor-pointer">
					<span>
						<svg xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24">
							<path fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 5v14m-7-7h14" />
						</svg>
					</span>
					<span>Add channel</span>
				</button>
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

	<div v-if="createChannelModelOpen"
		class="absolute z-10 top-0 bottom-0 left-0 right-0">
		<div class="bg-zinc-900/80 w-screen h-screen"
			@click="createChannelModelOpen = false">
		</div>
		<div
			class="p-4 z-20 absolute bg-zinc-800 shadow-md rounded-md -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 text-white">
			<h2 class="font-semibold text-xl">
				Create a channel:
			</h2>
			<div>
				<form @submit.prevent="createChannel"
					class="w-3/5">
					<input v-model="channelName"
						type="text"
						class="py-2 px-3 rounded-md mb-2 bg-zinc-700 shadow-md border border-zinc-700/80"
						placeholder="Channel name" />
					<input type="submit"
						class="py-2 px-3 rounded-md bg-zinc-700 shadow-md border border-zinc-700/80" />
				</form>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { useGlobalStore } from '~/stores/store';
import { IChannel, IRole, IServer } from '~/types';

export default {
	data() {
		return {
			server: storeToRefs(useGlobalStore()).activeServer,
			user: storeToRefs(useGlobalStore()).user,
			dms: storeToRefs(useGlobalStore()).dms,
			createChannelModelOpen: false,
			channelName: '',
			userIsOwner: false,
			userIsAdmin: false,
		}
	},
	async mounted() {
		const that = this;
		var interval = setInterval(function () {
			// get elem
			if (typeof that.server.roles == 'undefined') return;
			clearInterval(interval);

			that.userIsOwner = that.server.roles?.find((e: IRole) => e.users.some((el) => el.id === that.user.id))?.owner || false
			that.userIsAdmin = that.server.roles?.find((e: IRole) => e.users.some((el) => el.id === that.user.id))?.administer || false
		}, 10);
	},
	methods: {
		openCreateChannelModel() {
			this.createChannelModelOpen = true;
		},
		async createChannel() {
			const channel = await $fetch(`/api/guilds/${this.server.id}/addChannel`, { method: 'POST', body: { channelName: this.channelName } }) as IChannel

			if (!channel) return;

			this.server.channels?.push(channel)
			this.createChannelModelOpen = false;
		},
		openChannel(id: string) {
			const router = useRouter()

			router.push({ params: { id } })
		},
		async createInvite() {
			const inviteCode = await $fetch(`/api/guilds/${this.server.id}/createInvite`, { method: 'POST' })
		},
	},
}
</script>