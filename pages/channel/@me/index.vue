<template>
	<form @submit.prevent="startDM">
		<input v-model="userId" />
		<input type="submit" />
	</form>
</template>

<script>
import { useServerStore } from '~/stores/servers'

export default {
	data() {
		return {
			userId: ''
		}
	},
	methods: {
		async startDM() {
			const { server } = await $fetch('/api/channels/createDM', { method: 'post', body: { partnerId: this.userId } })

			useServerStore().addDM(server)
			useRouter().push({ path: '/channel/@me/' + server.id })
		}
	}
}
</script>