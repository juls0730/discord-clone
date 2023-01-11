<template>
	<MessagePane :server="server" />
</template>

<script lang="ts">
import { useGlobalStore } from '~/stores/store'
import { IChannel } from '~/types'

definePageMeta({
	middleware: 'auth'
})

export default {
	async setup() {
		const route = useRoute()

		const server: IChannel = await $fetch(`/api/channels/${route.params.id}`)
		if (!server) return;
		useGlobalStore().addDM(server);
		useGlobalStore().setActive('dms', server.id);

		return {
			server,
		}
	},
	async updated() {
		if (!useGlobalStore().activeServer == this.server) useGlobalStore().setActive('dms', this.server.id)
	},
}
</script>