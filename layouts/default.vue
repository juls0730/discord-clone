<template>
	<div class="flex h-screen max-h-screen text-white">
		<Nav />
		<Sidebar />
		<div class="w-[calc(100vw-88px-240px)] h-full">
			<slot />
		</div>
	</div>
</template>
  
<script lang="ts">
import { useGlobalStore } from '~/stores/store';
import { SafeUser, IChannel, IServer } from '~/types';
import { io } from 'socket.io-client';

export default {
	async setup() {
		const globalStore = useGlobalStore();
		if (globalStore.user.id === undefined) {
			const route = useRoute();
			const headers = useRequestHeaders(['cookie']) as Record<string, string>;
			const [user, { dms, servers }] = await Promise.all([
				$fetch('/api/getCurrentUser', { headers }) as unknown as SafeUser,
				$fetch('/api/user/getServers', { headers }) as unknown as { dms: IChannel[], servers: IServer[] }
			]);

			if (!user || !servers || !dms) return;

			globalStore.setUser(user);

			globalStore.setServers(servers);
			globalStore.setDms(dms);
			if (route.params.id && typeof route.params.id === 'string') {
				if (!globalStore.getServerByChannelId(route.params.id)) {
					navigateTo('/');
					return;
				}
				globalStore.setActiveServer(route.path.includes('@me') ? 'dms' : 'servers', route.params.id);
			} else {
				globalStore.setActiveServerType(route.path.includes('@me') ? 'dms' : 'servers');
			}
		}
	},
	data() {
		return {
			user: storeToRefs(useGlobalStore()).user,
		};
	},
	mounted() {
		const globalStore = useGlobalStore();
		const sessionToken = useCookie('sessionToken');
		const socket = io({
			auth: (cb) => {
				cb({ token: sessionToken.value });
			}
		});

		globalStore.setSocket(socket);
	}
};
</script>