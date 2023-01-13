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

		const headers = useRequestHeaders(['cookie']) as Record<string, string>
		const server: IChannel = await $fetch(`/api/channels/${route.params.id}`, { headers })
		if (!server) throw new Error('could not find the dm')
		useGlobalStore().addDM(server);
		if (typeof route.params.id !== 'string') throw new Error('route.params.id must be a string, but got an array presumably?')
		useGlobalStore().setActive('dms', route.params.id);

		return {
			server
		}
	},
	async updated() {
		const route = useRoute()
		if (typeof route.params.id !== 'string') throw new Error('route.params.id must be a string, but got an array presumably?')
		if (useGlobalStore().activeServer !== this.server) useGlobalStore().setActive('dms', route.params.id)
	},
}
</script>