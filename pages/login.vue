<script lang="ts" setup>
import { useDmStore } from '~/stores/dmStore';
import { useServerStore } from '~/stores/serverStore';
import { useUserStore } from '~/stores/userStore';
import { IChannel, IServer, SafeUser } from '~/types';
import { ref } from 'vue';

definePageMeta({
	layout: 'clean'
});

const username = ref('');
const password = ref('');

async function login() {
	if (!username.value || !password.value) return;
	const loginData = await $fetch('/api/login', {
		method: 'post', body: {
			username: username.value,
			password: password.value
		},
	}) as { token: string; user: SafeUser; };

	const token = useCookie('sessionToken');
	token.value = loginData.token;

	useUserStore().setUser(loginData.user);

	useServerStore().setServers(loginData.user.servers || [] as IServer[]);
	useDmStore().setDms(loginData.user.channels || [] as IChannel[]);

	return navigateTo('/');
}
</script>

<template>
  <div class="w-screen h-screen flex justify-center items-center bg-[var(--primary-bg)] text-[#fefefe]">
    <div class="bg-[var(--secondary-bg)] rounded-xl shadow-2xl flex flex-row overflow-hidden">
      <img
        src="/nahil-naseer-xljtGZ2-P3Y-unsplash.jpg"
        class="h-96 w-64 object-cover"
      />
      <div class="p-4 flex flex-col text-center">
        <h1 class="font-semibold text-2xl">
          Login
        </h1>
        <form
          class="flex flex-col gap-y-3 my-2"
          @submit.prevent="login"
        >
          <input
            v-model="username"
            class="px-4 py-2 rounded-md w-full bg-[var(--primary-input)] shadow-2xl placeholder:text-[var(--primary-placeholder)] focus:outline-none"
            name="username"
            placeholder="username"
          />
          <input
            v-model="password"
            class="px-4 py-2 rounded-md w-full bg-[var(--primary-input)] shadow-2xl placeholder:text-[var(--primary-placeholder)] focus:outline-none"
            name="password"
            type="password"
            placeholder="password"
          />
          <input
            type="submit"
            value="Submit"
            class="w-full bg-[#5865F2] py-2 px-4 rounded-md cursor-pointer"
          />
        </form>
        <p>
          or
          <nuxt-link to="/signup">
            Sign Up
          </nuxt-link>
        </p>
      </div>
    </div>
  </div>
</template>