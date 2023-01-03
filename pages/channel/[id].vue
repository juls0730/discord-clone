<template>
	hello world
</template>

<script setup async>
import { useServerStore } from '~/stores/servers'

const route = useRoute()

const { server } = await $fetch(`/api/channel/${route.params.id}`)
if (!useServerStore().servers.includes(server)) useServerStore().addServer(server);
</script>