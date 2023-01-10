<template>
	{{ $route.params.id }}
</template>

<script lang="ts">
import { useServerStore } from '~/stores/servers'

export default {
	async setup() {
		const route = useRoute()

		const { server } = await $fetch(`/api/guilds/${route.params.id}`)
		if (!server) return;
		useServerStore().addServer(server);
		await useServerStore().setActive('servers', server.id)
		return {
			server
		}
	},
	async updated() {
		if (!this.server) return;
		if (!await useServerStore().activeServer == this.server.id) await useServerStore().setActive('servers', this.server.id)
	}
}
</script>