<template>
  <div class="flex h-screen max-h-screen">
    <Nav />
    <Sidebar />
    <div class="w-[calc(100vw-88px-240px)] h-full">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { useUserStore } from '~/stores/userStore';
import { useServerStore } from '~/stores/serverStore';
import { useDmStore } from '~/stores/dmStore';
import { useActiveStore } from '~/stores/activeStore';
import { IChannel, IServer, SafeUser } from '~/types';

export default {
	async setup() {
		const userStore = useUserStore();
		const serverStore = useServerStore();
		const dmStore = useDmStore();
		const route = useRoute();
		const headers = useRequestHeaders(['cookie']) as Record<string, string>;

		if (!userStore.isLoggedIn) {
			const [userData, serverData] = await Promise.all([
				$fetch('/api/getCurrentUser', { headers }) as Promise<SafeUser | null>,
				$fetch('/api/user/getServers', { headers }) as Promise<{ dms: IChannel[], servers: IServer[] } | null>
			]);

			if (!userData || !serverData) throw new Error('No user data or server data');

			const { dms, servers } = serverData;

			userStore.setUser(userData);
			serverStore.setServers(servers);
			dmStore.setDms(dms);
		}

		const isDm = route.path.includes('@me');

		if (isDm && route.params.dmId && useActiveStore().dm.id !== route.params.dmId) {
			const dmData: IChannel = await $fetch(`/api/channels/${route.params.dmId}`, { headers });

			if (!dmData) throw new Error('Could not find dm.');

			useDmStore().addDM(dmData);
			useActiveStore().setActiveDM(dmData);
		}

		if (!isDm && route.params.channelId && useActiveStore().server.channel.id !== route.params.channelId) {
			const [channel, server] = await Promise.all([
				$fetch(`/api/channels/${route.params.channelId}`, { headers }) as Promise<IChannel | null>,
				$fetch(`/api/channels/${route.params.channelId}/guild`, { headers }) as Promise<IServer | null>
			]);

			if (!server || !channel) throw new Error('No channel or server');

			if (!server) throw new Error('Could not find server.');
			useServerStore().addServer(server);
			useActiveStore().setActiveServer(channel, useServerStore().servers);
		}

		if (isDm && !route.params.dmId) {
			// on '/@me'
			useActiveStore().setActiveHome();
		}
	}
};
</script>