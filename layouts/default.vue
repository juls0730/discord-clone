<template>
	<Suspense>
		<div class="flex h-screen max-h-screen text-white">
			<Nav />
			<Sidebar />
			<div class="w-[calc(100vw-88px-240px)] h-full">
				<slot />
			</div>

		</div>
		<template #fallback>
			Loading...
		</template>
	</Suspense>
</template>
  
<script lang="ts">
import { Nav, Sidebar } from '~/.nuxt/components'
import { useGlobalStore } from '~/stores/store'
import { SafeUser } from '~/types'
import { io } from 'socket.io-client'

export default {
	data() {
		return {
			user: storeToRefs(useGlobalStore()).user,
		}
	},
	async setup() {
		const globalStore = useGlobalStore()
		const sessionToken = useCookie('sessionToken')
		if (globalStore.user.id === undefined && sessionToken.value) {
			const route = useRoute()
			const headers = useRequestHeaders(['cookie']) as Record<string, string>
			const [user, { dms, servers }] = await Promise.all([
				$fetch('/api/getCurrentUser', { headers }) as unknown as SafeUser,
				$fetch('/api/user/getServers', { headers })
			])

			if (!user || !servers || !dms) return;

			globalStore.setUser(user)

			globalStore.setServers(servers)
			globalStore.setDms(dms)
			if (route.params.id && typeof route.params.id === 'string') {
				globalStore.setActiveServer(route.path.includes('@me') ? 'dms' : 'servers', route.params.id)
			}
		}
	},
	mounted() {
		const globalStore = useGlobalStore()
		const sessionToken = useCookie('sessionToken')
		const socket = io({
			auth: (cb) => {
				cb({ token: sessionToken.value })
			}
		});

		globalStore.setSocket(socket)
	}
}
</script>