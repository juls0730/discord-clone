<script lang="ts" setup>
import { useActiveStore } from '~/stores/activeStore';
import { useDmStore } from '~/stores/dmStore';
import { useEmojiPickerStore } from '~/stores/emojiPickerStore';
import { useUserStore } from '~/stores/userStore';
import { IUser, IRole } from '~/types';
import { ref, computed } from 'vue';

const userData = useUserStore().user;
const message = ref('');

async function fetchUser() {
	const emojiPickerData = useEmojiPickerStore().emojiPickerData;
	const headers = useRequestHeaders(['cookie']) as Record<string, string>;
	const activeServer = useActiveStore().server;

	const isDm = useRoute().path.includes('@me');

	let user: IUser | null;

	if (isDm) {
		user = await $fetch(`/api/user/${emojiPickerData.userId}/profile`, { headers }) as IUser | null;
	} else {
		user = await $fetch(`/api/user/${emojiPickerData.userId}/${activeServer.server.id}/profile`, { headers }) as IUser | null;
	}

	return { user, isDm };
}

const { user, isDm } = await fetchUser();
const roles = computed(() => {
	return user?.roles?.filter((e: IRole) => e.owner === false) || [];
});
const userIsOwner = computed(() => {
	return user?.roles?.some((e: IRole) => e.owner === true) || false;
});

async function sendDM() {
	if (!message.value.trim()) return;
	if (!user) return;

	const headers = useRequestHeaders(['cookie']) as Record<string, string>;
	const preExistingDM = useDmStore().getByPartnerId(user.id);

	if (!preExistingDM) return;
			
	if (preExistingDM && useRoute().path !== `/channel/@me/${preExistingDM.id}`) {
		await navigateTo(`/channel/@me/${preExistingDM.id}`);
	}

	await $fetch(`/api/channels/${preExistingDM.id}/sendMessage`, { method: 'post', body: { body: message.value }, headers });
	message.value = '';

	useEmojiPickerStore().closeEmojiPicker();
}

if (!user || !userData) throw new Error('unknown error');
</script>

<template>
  <div class="w-[374px] max-h-[475px] overflow-y-scroll text-[#fefefe]">
    <div class="relative h-[calc(160px+56px)]">
      <div class="w-full h-40 absolute">
        <img
          src="/tansu-topuzoglu-v2mlqhy5dLU-unsplash.jpg"
          class="h-40 w-full object-cover"
        />
      </div>
      <div class="w-[28%] aspect-square bg-[var(--primary-bg)] border-2 border-[var(--tertiary-bg)] rounded-xl overflow-hidden left-1/2 -translate-x-1/2 top-28 z-10 absolute">
        <img
          src="/daiga-ellaby-snUtnGUp2zU-unsplash.jpg"
          class="h-40 w-full object-cover"
        />
      </div>
    </div>
    <div class="px-3 pb-2">
      <div class="text-center">
        <p class="font-semibold">
          {{ user.username }}
        </p>
      </div>
      <hr class="border-[var(--tertiary-lightened-bg)] my-2" />
      <div class="m-1 p-2 rounded-lg bg-[var(--tertiary-bg)] flex flex-col gap-y-1">
        <div v-if="true">
          <p class="font-semibold text-sm">
            About Me
          </p>
          <div class="text-sm p-1">
            <p>lorem ipsum</p>
          </div>
        </div>
        <div>
          <p class="font-semibold text-sm">
            Member since
          </p>
          <div class="text-sm p-1">
            <p>
              {{
                new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                }) 
              }}
            </p>
          </div>
        </div>
        <div
          v-if="!isDm"
          class="mb-2"
        >
          <p
            v-if="roles.length < 1"
            class="font-semibold text-sm"
          >
            No Roles
          </p>
        </div>
        <div v-if="user.id !== userData.id">
          <input
            v-model="message"
            class="bg-[var(--secondary-bg)] placeholder:text-[var(--primary-placeholder)] px-2 focus:outline-none py-1 rounded-md w-full border border-[var(--tertiary-lightened-bg)]"
            :placeholder="`Message @${user.username}`"
            @keypress.enter="sendDM()"
          />
        </div>
      </div>
    </div>
  </div>
</template>