<template>
  <form @submit.prevent="startDM">
    <input v-model="userId">
    <input type="submit">
  </form>
</template>

<script lang="ts">
import { useActiveStore } from '~/stores/activeStore';
import { useDmStore } from '~/stores/dmStore';
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
		useActiveStore().type = 'dm';
	},
	methods: {
		async startDM() {
			const headers = useRequestHeaders(['cookie']) as Record<string, string>;
			const server: IChannel = await $fetch('/api/channels/createDM', { method: 'post', body: { partnerId: this.userId }, headers }); 

			useDmStore().addDM(server);
			useRouter().push({ path: '/channel/@me/' + server.id });
		}
	}
};
</script>