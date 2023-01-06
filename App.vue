<template>
	<div>
		<NuxtLayout>
			<div class="flex h-screen max-h-screen">
				<Nav :servers="servers" />
				<Sidebar :server="activeServer"
					:user="user" />
				<div class="w-full h-full">
					<NuxtPage :user="user" />
				</div>
			</div>
		</NuxtLayout>
	</div>
</template>
  
<script lang="ts">
import { useUserStore } from '~/stores/user'
import { useServerStore } from './stores/servers'

export default {
	data() {
		return {
			servers: useServerStore().servers,
			activeServer: storeToRefs(useServerStore()).activeServer,
			user: useUserStore().user
		}
	},
	async setup() {
		const userStore = useUserStore()
		const sessionToken = useCookie('sessionToken')
		if (userStore.user.id === undefined && sessionToken.value) {
			const user = await $fetch('/api/getCurrentUser')

			if (!user) return;

			userStore.setUser(user)
		}
	}
}
</script>