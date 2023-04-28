<template>
  <aside class="bg-[var(--secondary-bg)] min-w-60 w-60 h-screen shadow-sm text-white select-none relative z-[2]">
    <div
      v-if="activeServer.type === 'dm' || !activeServer.data.server"
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
        class="h-[calc(100%-12px)] grid grid-rows-[1fr_56px] bg-[var(--foreground-color)]"
      >
        <div class="h-fit">
          <nuxt-link
            v-for="dm in dms"
            :key="dm.id"
            class="hover:no-underline"
            :to="'/channel/@me/' + dm.id"
          >
            <div
              class="mx-2 my-4 bg-inherit hover:backdrop-brightness-[1.35] px-2 py-2 max-h-10 h-10 overflow-ellipsis transition-all"
            >
              {{ dm.dmParticipants?.find((e) => e.id !== user?.id)?.username }}
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
          class="py-3 px-4 font-semibold grid gap-1 grid-cols-[1fr_28px] w-full items-center cursor-pointer p-1 bg-inherit transition-all"
          :class="(!serverDropdownOpen) ? 'hover:backdrop-brightness-125' : 'backdrop-brightness-125'"
          @click="serverDropdownOpen = !serverDropdownOpen"
        >
          <span>{{ activeServer.data.server.name }}</span>
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
        class="h-[calc(100%-12px)] grid grid-rows-[1fr_56px] bg-[var(--foreground-color)] rounded-lg"
      >
        <div class="flex gap-y-1.5 px-1.5 mt-2 flex-col overflow-y-auto overflow-x-hidden">
          <nuxt-link
            v-for="channel in activeServer.data.server.channels"
            :key="channel.id"
            :to="'/channel/' + channel.id"
          >
            <button
              :class="(activeServer.data.channel.id === channel.id) ? 'backdrop-brightness-[1.35]' : 'hover:backdrop-brightness-[1.35]'"
              class="flex text-center bg-inherit px-2 py-1.5 w-full transition-all rounded drop-shadow-sm gap-1/5 cursor-pointer items-center"
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
              <span class="text-ellipsis w-fit whitespace-nowrap overflow-hidden">{{ channel.name }}</span>
            </button>
          </nuxt-link>
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
              <span class="h-fit w-fit overflow-ellipsis">{{ user?.username }}</span>
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

    <Modal
      :opened="createChannelModelOpen"
      @close="createChannelModelOpen = false"
    >
      <div
        class="bg-[var(--secondary-bg)] rounded-xl shadow-2xl flex flex-row overflow-hidden z-20 absolute border border-[var(--tertiary-bg)] -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
      >
        <img
          src="/ryan-klaus-5CkzYaubjkk-unsplash.jpg"
          class="h-96 w-64 object-cover"
        />
        <div class="p-4 flex flex-col text-center">
          <h1 class="font-semibold text-2xl">
            Create Channel
          </h1>
          <form
            class="flex flex-col gap-y-3 my-2"
            @submit.prevent="createChannel"
          >
            <input
              v-model="channelName"
              class="px-4 py-2 rounded-md w-full bg-[var(--primary-input)] shadow-2xl placeholder:text-[var(--primary-placeholder)] focus:outline-none"
              name="name"
              placeholder="Channel Name"
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
  </aside>
</template>

<script lang="ts">
import { useActiveStore } from '~/stores/activeStore';
import { useDmStore } from '~/stores/dmStore';
import { useServerStore } from '~/stores/serverStore';
import { useUserStore } from '~/stores/userStore';
import { IChannel, IRole } from '~/types';

export default {
	data() {
		return {
			activeServer: {
				type: storeToRefs(useActiveStore()).type,
				data: storeToRefs(useActiveStore()).server,
			},
			user: storeToRefs(useUserStore()).user,
			dms: storeToRefs(useDmStore()).dms,
			channelName: '',
			createChannelModelOpen: false,
			serverDropdownOpen: false,
			userDropdownOpen: false,
		};
	},
	computed: {
		userIsOwner() {
			return this.activeServer.type === 'server' && this.activeServer.data.server.participants.find((e) => e.id === this.user?.id)?.roles?.some((e) => e.owner === true);
		},
		userIsAdmin() {
			return this.activeServer.type === 'server' && this.activeServer.data.server.participants.find((e) => e.id === this.user?.id)?.roles?.some((e) => e.administer === true);
		}
	},
	methods: {
		openCreateChannelModel() {
			this.createChannelModelOpen = true;
		},
		async createChannel() {
			const headers = useRequestHeaders(['cookie']) as Record<string, string>;
			const channel = await $fetch(`/api/guilds/${this.activeServer.data.server.id}/addChannel`, { method: 'POST', body: { channelName: this.channelName }, headers }) as IChannel;

			if (!channel) return;

			useServerStore().addChannel(this.activeServer.data.server.id, channel);
			this.createChannelModelOpen = false;

			navigateTo(`/channel/${channel.id}`);
		},
		async createInvite() {
			const headers = useRequestHeaders(['cookie']) as Record<string, string>;
			const inviteCode = await $fetch(`/api/guilds/${this.activeServer.data.server.id}/createInvite`, { method: 'POST', headers });
		},
		logout() {
			useUserStore().logout();
		}
	}
};
</script>