<script lang="ts" setup>
import { useActiveStore } from '~/stores/activeStore';
import { useDmStore } from '~/stores/dmStore';
import { useUserStore } from '~/stores/userStore';
import { IChannel } from '~/types';
import { ref, onMounted } from 'vue';

definePageMeta({  
	middleware: 'auth'
});

const userId = ref('');
const user = useUserStore().user;
const selectedTab = ref('all' as 'all' | 'pending');

async function startDM() {
	const headers = useRequestHeaders(['cookie']) as Record<string, string>;
	const server: IChannel = await $fetch('/api/channels/createDM', { method: 'post', body: { partnerId: userId.value }, headers }); 
	useDmStore().addDM(server);
	useRouter().push({ path: '/channel/@me/' + server.id });
}

function changeTab(type: 'all' | 'pending') {
	selectedTab.value = type;
}

onMounted(() => {
	useActiveStore().setActiveHome();
});
</script>

<template>
  <div
    class="h-full relative bg-[var(--primary-bg)] flex flex-col text-[#fefefe]"
  >
    <header class="py-3 px-2">
      <div class="flex flex-row items-center">
        <span class="flex items-center mr-4">
          <span class="mr-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
            ><path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0-8 0M6 21v-2a4 4 0 0 1 4-4h.5m7.5 7l3.35-3.284a2.143 2.143 0 0 0 .005-3.071a2.242 2.242 0 0 0-3.129-.006l-.224.22l-.223-.22a2.242 2.242 0 0 0-3.128-.006a2.143 2.143 0 0 0-.006 3.071L18 22z"
            /></svg>
          </span>
          <span class="text-xl">
            Friends
          </span>
        </span>
        <div class="flex flex-row gap-x-2">
          <button
            class="px-2.5 py-0.5 bg-inherit backdrop-filter rounded-md transition-all drop-shadow-sm"
            :class="(selectedTab === 'all') ? 'backdrop-brightness-[1.35]' : 'hover:backdrop-brightness-[1.35]'"
            @click="changeTab('all')"
          >
            All
          </button>
          <button
            class="px-2.5 py-0.5 bg-inherit backdrop-filter rounded-md transition-all drop-shadow-sm"
            :class="(selectedTab === 'pending') ? 'backdrop-brightness-[1.35]' : 'hover:backdrop-brightness-[1.35]'"
            @click="changeTab('pending')"
          >
            Pending 
            <span
              v-if="user.incomingFriendRequests?.length > 0"
              class="text-sm px-1 py-px rounded bg-blue-700"
            >{{ user?.incomingFriendRequests?.length }}</span>
          </button>
        </div>
      </div>
    </header>
		
    <main class="px-3 py-1.5 w-full">
      <div v-if="selectedTab === 'all'">
        <div v-if="user.friends?.length > 0">
          <div
            v-for="friend in user?.friends"
            :key="friend.id"
          >
            <FriendChip
              :user="friend"
              :request="{ isRequest: false }"
            />
          </div>
        </div>
        <div v-else>
          No friends yet...
        </div>
      </div>
      <div v-if="selectedTab === 'pending'">
        <div
          v-for="outgoingRequest in user?.outgoingFriendRequests"
          :key="outgoingRequest.id"
        >
          <FriendChip
            :user="outgoingRequest.recipient"
            :request="{ isRequest: true, outgoing: true, id: outgoingRequest.id }"
          />
        </div>
        <div
          v-for="incomingRequest in user?.incomingFriendRequests"
          :key="incomingRequest.id"
        >
          <FriendChip
            :user="incomingRequest.sender"
            :request="{ isRequest: true, incoming: true, id: incomingRequest.id }"
          />
        </div>
      </div>
    </main>
  </div>
</template>