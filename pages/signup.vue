<template>
  <div class="w-screen h-screen flex justify-center items-center bg-[var(--primary-bg)]">
    <div class="bg-[var(--secondary-bg)] rounded-xl shadow-2xl flex flex-row overflow-hidden">
      <img
        src="/annie-spratt-8mqOw4DBBSg-unsplash.jpg"
        class="h-96 w-64 object-cover filter brightness-95"
      />
      <div class="p-4 flex flex-col text-center">
        <h1 class="font-semibold text-2xl">
          Sign Up
        </h1>
        <form
          class="flex flex-col gap-y-3 my-2"
          @submit.prevent="signup"
        >
          <input
            v-model="username"
            class="px-4 py-2 rounded-md w-full bg-[var(--primary-input)] shadow-2xl placeholder:text-[var(--primary-placeholder)] focus:outline-none"
            name="username"
            placeholder="username"
          />
          <input
            v-model="email"
            class="px-4 py-2 rounded-md w-full bg-[var(--primary-input)] shadow-2xl placeholder:text-[var(--primary-placeholder)] focus:outline-none"
            type="email"
            name="email"
            placeholder="email"
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
            class="w-full bg-[#5865F2] py-2 px-4 rounded cursor-pointer"
          />
        </form>
        <p>
          or
          <nuxt-link to="/login">
            Login
          </nuxt-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useDmStore } from '~/stores/dmStore';
import { useServerStore } from '~/stores/serverStore';
import { useUserStore } from '~/stores/userStore';
import { IChannel, IServer, SafeUser } from '~/types';

definePageMeta({
	layout: 'clean'
});

export default {
	data() {
		return {
			username: '',
			email: '',
			password: ''
		};
	},
	methods: {
		async signup() {
			if (!this.username || !this.password || !this.email) return;
			const signupData = await $fetch('/api/signup', {
				method: 'post', body: {
					username: this.username,
					email: this.email,
					password: this.password
				},
			}) as { token: string; user: SafeUser; };

			const userId = useCookie('userId');
			userId.value = signupData.user.id;
			const token = useCookie('sessionToken');
			token.value = signupData.token;

			useUserStore().setUser(signupData.user);

			useServerStore().setServers(signupData.user.servers || [] as IServer[]);
			useDmStore().setDms(signupData.user.channels || [] as IChannel[]);

			return navigateTo('/');
		}
	}
};
</script>