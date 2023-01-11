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
		useGlobalStore().addDM(server);
		await useGlobalStore().setActive('dms', server.id);

		console.log(server)
		return {
			server,
		}
	},
	async updated() {
		if (!useGlobalStore().activeServer == this.server) await useGlobalStore().setActive('dms', this.server.id)
	},
}
</script>