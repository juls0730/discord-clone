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

		const realServer = useGlobalStore().servers?.find((e) => e.channels.some((el) => el.id == route.params.id))

		if (!realServer) throw new Error('realServer not found, this means that the channel is serverless but not a dm????');
		useGlobalStore().addServer(realServer);
		if (typeof route.params.id !== 'string') throw new Error('route.params.id must be a string, but got an array presumiably?')
		useGlobalStore().setActive('servers', route.params.id)

		function parseBody(body) {
			const mentions = body.match(/<@([a-z]|[0-9]){25}>/g);

			if (mentions) {
				mentions.forEach((e: string) => {
					if (!e) return
					const id = e.split('<@')[1]?.split('>')[0];
					if (!id) return;
					const user = realServer?.participants.find((e) => e.id === id)
					body = body.split(e).join(`@${user.username}`)
				});
			}

			return body
		}

		server.messages?.forEach((e) => {
			e.body = parseBody(e.body)
		})

		return {
			server,
		}
	},
	async updated() {
		const route = useRoute()
		const headers = useRequestHeaders(['cookie']) as Record<string, string>;
		if (!this.server) return;

		this.server = await $fetch(`/api/channels/${route.params.id}`, { headers });

		if (typeof route.params.id !== 'string') throw new Error('route.params.id must be a string, but got an array presumiably?')
		if (useGlobalStore().activeServer.id !== this.server.id) {
			useGlobalStore().setActive('servers', route.params.id)
		}
	}
}
</script>