<template>
  <form @submit.prevent="startDM">
    <input v-model="userId">
    <input type="submit">
  </form>
</template>

<script lang="ts">
import { useGlobalStore } from '~/stores/store';
import { IChannel } from '~/types';

definePageMeta({  
	middleware: 'auth'
});

export default {
	data() {
		return {
			userId: ''
		};
	},
	mounted() {
		useGlobalStore().setActiveServer('dms', '@me');
	},
	methods: {
		async startDM() {
			const headers = useRequestHeaders(['cookie']) as Record<string, string>;
			const server: IChannel = await $fetch('/api/channels/createDM', { method: 'post', body: { partnerId: this.userId }, headers }); 

			useGlobalStore().addDM(server);
			useRouter().push({ path: '/channel/@me/' + server.id });
		}
	}
};
</script>