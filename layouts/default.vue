<template>
	<Suspense>
		<div v-if="user.id"
			class="flex h-screen max-h-screen text-white">
			<Nav :user="user" />
			<Sidebar :server="activeServer"
				:user="user" />
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

export default {
	data() {
		return {
			activeServer: storeToRefs(useGlobalStore()).activeServer,
			user: storeToRefs(useGlobalStore()).user
		}
	},
	async setup() {

		const userStore = useGlobalStore()
		const sessionToken = useCookie('sessionToken')
		if (userStore.user.id === undefined && sessionToken.value) {
			const user: SafeUser = await $fetch('/api/getCurrentUser')

			if (!user) return;

			userStore.setUser(user)
		}
	}
}
</script>