<template>
  <nav class="bg-[var(--primary-bg)] h-screen p-4 grid grid-cols-1 grid-rows-[56px_1fr_56px] shadow shadow-black/80">
    <div>
      <nuxt-link
        to="/channel/@me"
        draggable="false"
      >
        <button
          class="bg-[var(--tertiary-bg)] p-3 transition-all ease-in-out hover:bg-[var(--tertiary-lightened-bg)] duration-300"
          :class="(activeConversation.type === 'dm') ? 'rounded-[1.375rem]' : 'rounded-full hover:rounded-[1.375rem]'"
          aria-label="Home"
        >
          <span>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <defs>
                <linearGradient
                  id="fire"
                  x1="-2.778%"
                  x2="100%"
                  y1="24%"
                  y2="48%"
                >
                  <stop
                    offset="0%"
                    stop-color="#ff0c41"
                  />
                  <stop
                    offset="100%"
                    stop-color="#ff6b0c"
                  />
                </linearGradient>
              </defs>
              <path
                fill="none"
                stroke="url(#fire)"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 12c2-2.96 0-7-1-8c0 3.038-1.773 4.741-3 6c-1.226 1.26-2 3.24-2 5a6 6 0 1 0 12 0c0-1.532-1.056-3.94-2-5c-1.786 3-2.791 3-4 2z"
              />
            </svg>
          </span>
        </button>
      </nuxt-link>
    </div>
    <div class="overflow-y-auto overflow-x-hidden my-2 flex gap-y-2 flex-col">
      <div class="w-full flex justify-center">
        <hr class="border-2 rounded-md border-[var(--tertiary-bg)] w-8/12 my-0.5">
      </div>

      <nuxt-link
        v-for="server in servers"
        :key="server.id"
        :to="'/channel/' + server.channels[0]?.id"
        draggable="false"
      >
        <button
          class="bg-[var(--tertiary-bg)] p-3 transition-all ease-in-out hover:bg-[var(--tertiary-lightened-bg)] duration-300 h-[56px] w-[56px]"
          :class="(activeConversation.type === 'server' && activeConversation.server.server.id === server.id) ? 'rounded-[1.375rem]' : 'rounded-full hover:rounded-[1.375rem]'"
          :aria-label="server.name"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
          ><g
            fill="none"
            stroke="var(--primary-placeholder)"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          ><path d="m8 9l3 3l-3 3m5 0h3" /><path d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></g></svg>
        </button>
      </nuxt-link>
    </div>

    <button
      class="p-3 rounded-full transition-colors ease-in-out hover:bg-[var(--tertiary-lightened-bg)] duration-300 cursor-pointer"
      @click="createServerModalOpen = true"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
      >
        <path
          fill="none"
          stroke="var(--primary-accent)"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 5v14m-7-7h14"
        />
      </svg>
    </button>
    <Modal
      :opened="createServerModalOpen"
      @close="createServerModalOpen = false"
    >
      <div
        class="bg-[var(--secondary-bg)] rounded-xl shadow-2xl flex flex-row overflow-hidden z-20 absolute border border-[var(--tertiary-bg)] -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
      >
        <img
          src="/eberhard-grossgasteiger-eBXIZe1DU7Y-unsplash.jpg"
          class="h-96 w-64 object-cover"
        />
        <div class="p-4 flex flex-col text-center">
          <h1 class="font-semibold text-2xl">
            Create Server
          </h1>
          <form
            class="flex flex-col gap-y-3 my-2"
            @submit.prevent="createServer"
          >
            <input
              v-model="serverName"
              class="px-4 py-2 rounded-md w-full bg-[var(--primary-input)] shadow-2xl placeholder:text-[var(--primary-placeholder)] focus:outline-none"
              name="name"
              placeholder="Server Name"
            />
            <input
              type="submit"
              value="Submit"
              class="w-full bg-[#5865F2] py-2 px-4 rounded-md cursor-pointer"
            />
          </form>
        </div>
      </div>
    </Modal>
  </nav>
</template>

<script lang="ts">
import { useActiveStore } from '~/stores/activeStore';
import { useServerStore } from '~/stores/serverStore';
import { IServer } from '~/types';

export default {
	data() {
		return {
			createServerModalOpen: false,
			serverName: '',
			servers: storeToRefs(useServerStore()).servers,
			activeConversation: {
				type: storeToRefs(useActiveStore()).type,
				server: storeToRefs(useActiveStore()).server
			}
		};
	},
	methods: {
		async createServer() {
			const serverStore = useServerStore();
			const headers = useRequestHeaders(['cookie']) as Record<string, string>;
			const server: IServer = await $fetch('/api/channels/create', { method: 'post', body: { serverName: this.serverName }, headers });
			this.createServerModalOpen = false;
			this.serverName = '';
			serverStore.addServer(server);

			navigateTo(`/channel/${server.channels[0].id}`);
		}
	}
};
</script>