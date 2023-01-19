<template>
	<div class="w-6/12 bg-[var(--primary-500)] mb-1 mt-0.5 p-4 rounded-md shadow-md mr-2">
		<p class="text-sm font-semibold text-zinc-100">You've been invited to join a
			server</p>
		<span class="text-xl font-bold capitalize leading-loose">{{ invite.server.name }}</span>
		<div class="flex items-center">
			<span
				class="before:bg-[var(--invite-members)] before:h-2 before:w-2 before:inline-block before:my-auto before:rounded-full before:mr-1"></span>
			<span>{{ invite.server.participants.length }} Members</span>
		</div>
		<div class="flex w-full justify-end">
			<button @click="joinServer(invite)"
				class="font-semibold rounded px-4 py-2 transition-colors"
				:class="(userInServer) ? 'bg-green-800 cursor-not-allowed' : 'bg-green-700 hover:bg-green-600'">
				<span v-if="userInServer">
					Joined
				</span>
				<span v-else>
					Join
				</span>
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import { useGlobalStore } from '~/stores/store'
import { IInviteCode, IUser } from '~/types'

export default {
	props: ['invite'],
	data() {
		return {
			user: storeToRefs(useGlobalStore()).user,
			servers: storeToRefs(useGlobalStore()).servers,
		}
	},
	computed: {
		userInServer(): boolean {
			return !!this.invite.server.participants.find((e: IUser) => e.id === this.user.id)
		}
	},
	methods: {
		async joinServer(invite: IInviteCode) {
			if (this.userInServer) return;
			const headers = useRequestHeaders(['cookie']) as Record<string, string>;
			const { server } = await $fetch('/api/guilds/joinGuild', { method: 'POST', body: { inviteId: invite.id }, headers })
			if (!server) return;
			this.servers?.push(server)
			this.invite.server.participants.push(this.user)
		},
	}
}
</script>