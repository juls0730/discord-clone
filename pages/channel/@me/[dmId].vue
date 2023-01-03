<template>
	hello world
</template>

<script>
import { useServerStore } from '~/stores/servers'

export default {
	async setup() {
		const route = useRoute()

		const { server } = await $fetch(`/api/channel/${route.params.dmId}`)
		if (!useServerStore().dms.includes(server)) useServerStore().addDM(server);
	}
}
</script>