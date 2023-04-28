<template>
  <div class="w-6/12 bg-[var(--secondary-bg)] mb-1 mt-0.5 p-4 rounded-md shadow-md mr-2">
    <p class="text-sm font-semibold text-zinc-100">
      You've been invited to join a
      server
    </p>
    <span class="text-xl font-bold capitalize leading-loose">{{ invite.server.name }}</span>
    <div class="flex flex-row">
      <div class="flex items-center mr-4">
        <span
          class="before:bg-[var(--primary-accent)] before:h-2 before:w-2 before:inline-block before:my-auto before:rounded-full before:mr-1"
        />
        <span>{{ invite.server.participants.length }} Members</span>
      </div>
      <div class="flex items-center">
        <span
          class="before:bg-[var(--primary-accent)] before:h-2 before:w-2 before:inline-block before:my-auto before:rounded-full before:mr-1"
        />
        <span>{{ invite.server.participants.filter((e: SafeUser) => !!e.online).length }} Online</span>
      </div>
    </div>
    <div class="flex w-full justify-end">
      <button
        class="font-semibold rounded px-4 py-2 transition-colors"
        :class="(userInServer) ? 'bg-green-800 cursor-not-allowed' : 'bg-green-700 hover:bg-green-600'"
        @click="joinServer(invite)"
      >
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
import { PropType } from 'vue';
import { useServerStore } from '~/stores/serverStore';
import { useUserStore } from '~/stores/userStore';
import { IInviteCode, IServer, IUser, SafeUser } from '~/types';

export default {
	props: {
		invite: {
			type: Object as PropType<IInviteCode>,
			required: true
		}
	},
	data() {
		return {
			user: storeToRefs(useUserStore()).user,
			servers: storeToRefs(useServerStore()).servers,
		};
	},
	computed: {
		userInServer(): boolean {
			return !!this.invite.server.participants.find((e: SafeUser) => e.id === this.user?.id);
		}
	},
	methods: {
		async joinServer(invite: IInviteCode) {
			if (this.userInServer) return;
			
			const headers = useRequestHeaders(['cookie']) as Record<string, string>;
			const { server } = await $fetch('/api/guilds/joinGuild', { method: 'POST', body: { inviteId: invite.id }, headers }) as { server: IServer };
			if (!server) return;

			useServerStore().addServer(server);
			this.invite.server.participants.push(this.user);
		},
	}
};
</script>