<template>
	<MessagePane :server="server" />
</template>

<script lang="ts">
import { useGlobalStore } from '~/stores/store'

definePageMeta({
	middleware: 'auth'
})

export default {
	async setup() {
		const route = useRoute()

		const { channel: server } = await $fetch(`/api/channels/${route.params.id}`)
		if (!server) return;

		const realServer = await useGlobalStore().user.servers.find((e) => e.channels.some((el) => el.id == route.params.id ) )

		useGlobalStore().addServer(realServer);
		await useGlobalStore().setActive('servers', realServer.id)


		return {
			server
		}
	},
	async updated() {
		if (!this.server) return;

		this.server = await $fetch(`/api/channels/${route.params.id}`);

		if (!await useGlobalStore().activeServer == this.server.id) await useGlobalStore().setActive('servers', this.server.id)
	}
}
</script>