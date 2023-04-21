<!-- eslint-disable vue/no-multiple-template-root -->
<template>
  <aside class="bg-[var(--background-color)] min-w-60 w-60 h-screen shadow-sm text-white select-none relative z-[2]">
    <div
      v-if="serverType === 'dms' || !server"
      class="h-full grid grid-rows-[48px_1fr] w-full"
    >
      <section>
        <h4
          class="py-3 px-4 font-semibold grid gap-1 grid-cols-[1fr_28px] w-full items-center p-1 bg-inherit transition-all"
        >
          <span>Direct messages</span>
        </h4>
      </section>

      <div
        class="h-[calc(100%-12px)] mb-3 mx-1 grid grid-rows-[1fr_56px] bg-[var(--foreground-color)] rounded-lg"
      >
        <div class="h-fit">
          <nuxt-link
            v-for="dm in dms"
            :key="dm.id"
            :to="'/channel/@me/' + dm.id"
          >
            <div
              class="mx-2 my-4 bg-inherit hover:backdrop-brightness-[1.35] px-2 py-2 max-h-10 h-10 overflow-ellipsis rounded-md transition-all"
            >
              {{ dm.dmParticipants?.find((e) => e.id !== user.id)?.username }}
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
    <div
      v-else
      class="w-full h-full max-h-screen grid grid-rows-[48px_1fr]"
    >
      <section>
        <h4
          class="py-3 px-4 font-semibold grid gap-1 grid-cols-[1fr_28px] w-full items-center cursor-pointer p-1 bg-inherit transition-all rounded-lg"
          :class="(!serverDropdownOpen) ? 'hover:backdrop-brightness-125' : 'backdrop-brightness-125'"
          @click="serverDropdownOpen = !serverDropdownOpen"
        >
          <span>{{ server.name }}</span>
          <button>
            <span
              v-if="!serverDropdownOpen"
              class="h-fit w-[20px]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m6 9l6 6l6-6"
                />
              </svg>
            </span>
            <span
              v-else
              class="h-fit w-[20px]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M18 6L6 18M6 6l12 12"
                />
              </svg>
            </span>
          </button>
        </h4>
        <div>
          <DropdownMenu :opened="serverDropdownOpen">
            <div>
              <ul class="flex flex-col gap-y-1">
                <DropdownItem
                  v-if="userIsOwner || userIsAdmin"
                  @click="createInvite"
                >
                  <span>
                    Invite a friend
                  </span>
                  <span class="h-fit">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <g
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                      >
                        <circle
                          cx="9"
                          cy="7"
                          r="4"
                        />
                        <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2m1-10h6m-3-3v6" />
                      </g>
                    </svg>
                  </span>
                </DropdownItem>
              </ul>
            </div>
          </DropdownMenu>
        </div>
      </section>


      <div
        class="h-[calc(100%-12px)] mb-3 mx-1 grid grid-rows-[1fr_56px] bg-[var(--foreground-color)] rounded-lg"
      >
        <div class="flex gap-y-1.5 px-1.5 mt-2 flex-col overflow-x-scroll">
          <button
            v-for="channel in server.channels"
            :key="channel.id"
            :class="(activeChannel.id === channel.id) ? 'backdrop-brightness-[1.35]' : 'hover:backdrop-brightness-[1.35]'"
            class="flex text-center bg-inherit px-2 py-1.5 w-full transition-all rounded drop-shadow-sm gap-1/5 cursor-pointer items-center"
            @click="openChannel(channel.id)"
          >
            <span class="h-fit">
              <svg
                class="text-zinc-300/80 my-auto"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="m5.41 21l.71-4h-4l.35-2h4l1.06-6h-4l.35-2h4l.71-4h2l-.71 4h6l.71-4h2l-.71 4h4l-.35 2h-4l-1.06 6h4l-.35 2h-4l-.71 4h-2l.71-4h-6l-.71 4h-2M9.53 9l-1.06 6h6l1.06-6h-6Z"
                />
              </svg>
            </span>
            <span>{{ channel.name }}</span>
          </button>
          <button
            v-if="userIsOwner || userIsAdmin"
            class="flex text-center bg-inherit hover:backdrop-brightness-[1.45] px-2 py-1.5 w-full transition-all rounded drop-shadow-sm cursor-pointer items-center"
            @click="openCreateChannelModel"
          >
            <span>
              <svg
                class="text-zinc-300/80 my-auto"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 5v14m-7-7h14"
                />
              </svg>
            </span>
            <span>Add channel</span>
          </button>
        </div>

        <div class="relative bottom-0">
          <DropdownMenu
            class="bottom-full"
            :inverted="true"
            :opened="userDropdownOpen"
          >
            <div>
              <ul class="flex flex-col gap-y-1">
                <DropdownItem
                  v-if="userIsOwner || userIsAdmin"
                  @click="createInvite"
                >
                  <span>
                    Invite a friend
                  </span>
                  <span class="mr-1.5 h-fit">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <g
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                      >
                        <circle
                          cx="9"
                          cy="7"
                          r="4"
                        />
                        <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2m1-10h6m-3-3v6" />
                      </g>
                    </svg>
                  </span>
                </DropdownItem>
                <DropdownItem
                  danger="true"
                  @click="logout"
                >
                  <span>
                    Logout
                  </span>
                  <span class="mr-1.5 h-fit">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <g
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                      >
                        <path
                          d="M14 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2"
                        />
                        <path d="M7 12h14l-3-3m0 6l3-3" />
                      </g>
                    </svg>
                  </span>
                </DropdownItem>
              </ul>
            </div>
          </DropdownMenu>
          <div class="h-full p-3">
            <div class="grid grid-cols-[32px_1fr_32px] gap-x-2 items-center">
              <span class="bg-[hsl(220,calc(1*6.8%),22.6%)] w-[32px] h-[32px] rounded-full" />
              <span class="h-fit w-fit overflow-ellipsis">{{ user.username }}</span>
              <button
                class="text-zinc-300 hover:backdrop-brightness-90 p-1 rounded-md transition-all"
                @click="userDropdownOpen = !userDropdownOpen"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <g
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  >
                    <path
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37c1 .608 2.296.07 2.572-1.065z"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                    />
                  </g>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>

  <div
    v-if="createChannelModelOpen"
    class="absolute z-10 top-0 bottom-0 left-0 right-0"
  >
    <div
      class="bg-black/70 w-screen h-screen"
      @click="createChannelModelOpen = false"
    />
    <div
      class="p-4 z-20 absolute bg-[var(--primary-500)] shadow-md rounded-md -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 text-white"
    >
      <h2 class="font-semibold text-xl">
        Create a channel:
      </h2>
      <div>
        <form
          class="w-3/5"
          @submit.prevent="createChannel"
        >
          <input
            v-model="channelName"
            type="text"
            class="py-2 px-3 rounded-md mb-2 bg-[var(--message-input-color)] shadow-md"
            placeholder="Channel name"
          >
          <input
            type="submit"
            class="py-2 px-3 rounded-md bg-[var(--message-input-color)] shadow-md"
          >
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useGlobalStore } from '~/stores/store';
import { IChannel, IRole } from '~/types';

export default {
	setup() {
		console.log('sidebar', useGlobalStore().activeServer.channels);
	},
	data() {
		return {
			server: storeToRefs(useGlobalStore()).activeServer,
			serverType: storeToRefs(useGlobalStore()).activeServerType,
			activeChannel: storeToRefs(useGlobalStore()).activeChannel,
			user: storeToRefs(useGlobalStore()).user,
			dms: storeToRefs(useGlobalStore()).dms,
			createChannelModelOpen: false,
			serverDropdownOpen: false,
			userDropdownOpen: false,
			channelName: '',
		};
	},
	computed: {
		userIsOwner() {
			return this.server && this.serverType === 'servers' && this.server.roles?.find((e: IRole) => e.users.some((el) => el.id === this.user.id))?.owner;
		},
		userIsAdmin() {
			return this.server && this.serverType === 'servers' && this.server.roles?.find((e: IRole) => e.users.some((el) => el.id === this.user.id))?.administer;
		}
	},
	methods: {
		openCreateChannelModel() {
			this.createChannelModelOpen = true;
		},
		async createChannel() {
			const headers = useRequestHeaders(['cookie']) as Record<string, string>;
			const channel = await $fetch(`/api/guilds/${this.server.id}/addChannel`, { method: 'POST', body: { channelName: this.channelName }, headers }) as IChannel;

			if (!channel) return;

			useGlobalStore().addChannel(this.server.id, channel);
			this.createChannelModelOpen = false;
		},
		openChannel(id: string) {
			const router = useRouter();

			router.push({ params: { id } });
		},
		async createInvite() {
			const headers = useRequestHeaders(['cookie']) as Record<string, string>;
			const inviteCode = await $fetch(`/api/guilds/${this.server.id}/createInvite`, { method: 'POST', headers });
		},
		async logout() {
			await $fetch('/api/user/logout');
			useCookie('sessionToken').value = null;
			useCookie('userId').value = null;

			useGlobalStore().logout();
			navigateTo('/login');
		}
	},
};
</script>