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
import { IChannel } from '~/types';

export default {
	async setup() {
		const userStore = useUserStore();
		const serverStore = useServerStore();
		const dmStore = useDmStore();
		const route = useRoute();
		const headers = useRequestHeaders(['cookie']) as Record<string, string>;

		if (!userStore.isLoggedIn) {
			const [userData, serverData] = await Promise.all([
				$fetch('/api/getCurrentUser', { headers }),
				$fetch('/api/user/getServers', { headers })
			]);

			if (!userData || !serverData) throw new Error('No user data or server data');

			const { dms, servers } = serverData;

			userStore.setUser(userData);
			serverStore.setServers(servers);
			dmStore.setDms(dms);
		}

		const isDm = route.path.includes('@me');

		if (isDm && route.params.dmId) {
			const dmData: IChannel = await $fetch(`/api/channels/${route.params.dmId}`, { headers });

			if (!dmData) throw new Error('Could not find dm.');

			useDmStore().addDM(dmData);
			useActiveStore().setActiveDM(dmData);
		}

		if (!isDm && route.params.channelId) {
			const [channel, server] = await Promise.all([
				$fetch(`/api/channels/${route.params.channelId}`, { headers }) as unknown as IChannel,
				$fetch(`/api/channels/${route.params.channelId}/guild`, { headers })
			]);

			if (!server) throw new Error('Could not find server.');
			useServerStore().addServer(server);
			useActiveStore().setActiveServer(channel, useServerStore().servers);
		}

		if (isDm && !route.params.dmId) {
			// on '/@me'
			useActiveStore().type = 'dm';
		}

		// const socket = ref(null);

		// socket.value = io('127.0.0.1:3000', {
		// 	auth: (cb) => cb({ token: useCookie('sessionToken').value })
		// });
	}
};
</script>