<script lang="ts" setup>
import { PropType } from 'vue';
import { useUserStore } from '~/stores/userStore';
import { IUser } from '~/types';

const props = defineProps({
	user: {
		type: Object as PropType<IUser>,
		required: true
	},
	request: {
		type: Object as PropType<{ isRequest: boolean; incoming?: boolean; outgoing?: boolean; id?: string; }>,
		required: true
	}
});

async function cancelFriendRequest() {
	if (!props.request.id) return;
	const headers = useRequestHeaders(['cookie']) as Record<string, string>;
	await $fetch(`/api/user/friends/${props.request.id}/cancel`, { method: 'POST', headers });
	useUserStore().removeFriendRequest(props.request.id);
}

async function acceptFriendRequest() {
	if (!props.request.id) return;
	const headers = useRequestHeaders(['cookie']) as Record<string, string>;
	await $fetch(`/api/user/friends/${props.request.id}/accept`, { method: 'POST', headers });
}
</script>

<template>
  <div class="w-full px-3.5 py-2 flex flex-row border-t border-[var(--tertiary-bg)]">
    <div class="flex flex-row">
      <div class="bg-[var(--tertiary-bg)] w-10 h-10 rounded-full mr-2.5" />
      <div>
        {{ user.username }}
      </div>
    </div>
    <div class="ml-auto flex gap-x-2 items-center">
      <button
        v-if="request.isRequest && request.incoming"
        class="w-8 h-8 bg-[var(--tertiary-bg)] rounded-full hover:bg-[var(--tertiary-lightened-bg)] transition-colors flex items-center justify-center"
        @click="acceptFriendRequest"
      >
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
          ><path
            fill="none"
            stroke="var(--primary-placeholder)"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m5 12l5 5L20 7"
          /></svg>
        </span>
      </button>
      <button
        v-if="request.isRequest"
        class="w-8 h-8 bg-[var(--tertiary-bg)] rounded-full hover:bg-[var(--tertiary-lightened-bg)] transition-colors flex items-center justify-center"
        @click="cancelFriendRequest"
      >
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
          ><path
            fill="none"
            stroke="var(--primary-placeholder)"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M18 6L6 18M6 6l12 12"
          /></svg>
        </span>
      </button>
    </div>
  </div>
</template>