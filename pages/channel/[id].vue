<template>
	<MessagePane :server="server" />
</template>

<script async setup lang="ts">
const route = useRoute()

const server: IChannel = await $fetch(`/api/channels/${route.params.id}`)

const realServer = useGlobalStore().user.servers.find((e) => e.channels.some((el) => el.id == route.params.id))

if (realServer) {
	useGlobalStore().addServer(realServer);
	useGlobalStore().setActive('servers', realServer.id)
}
</script>

<script lang="ts">
import { useGlobalStore } from '~/stores/store'
import { IChannel } from '~/types'

definePageMeta({
	middleware: 'auth'
})

export default {
	async updated() {
		if (!this.server) return;

		this.server = await $fetch(`/api/channels/${route.params.id}`);

		if (!useGlobalStore().activeServer == this.server.id) useGlobalStore().setActive('servers', this.server.id)
	}
}
</script>