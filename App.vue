<template>
	<div>
		<NuxtLayout>
			<div class="flex h-screen max-h-screen">
				<Nav />
				<Sidebar />
				<NuxtPage />
			</div>
		</NuxtLayout>
	</div>
</template>
  
<script lang="ts">
import { useUserStore } from '~/stores/user'

export default {
	async setup() {
		const userStore = useUserStore()
		const sessionToken = useCookie('sessionToken')
		console.log(sessionToken.value)
		if (userStore.user.id === undefined && sessionToken.value) {
			const user = await $fetch('/api/getCurrentUser')

			if (!user) return;

			userStore.setUser(user)
		}
	}
}
</script>