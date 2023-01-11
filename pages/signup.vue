<template>
	<div class="w-screen h-screen bg-[hsl(216,calc(1*7.2%),10%)] relative">
		<div
			class="-translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2 absolute bg-[hsl(216,calc(1*7.2%),16%)] p-4 rounded-md shadow-lg">
			<h2 class="text-xl font-semibold text-center">Sign up</h2>
			<form class="flex flex-col gap-y-2 my-2"
				@submit.prevent="signup()">
				<input
					class="border border-[hsl(218,calc(1*7.9%),23.7%)] px-4 py-2 rounded w-full bg-[hsl(218,calc(1*7.9%),27.3%)] placeholder:text-[hsl(218,calc(1*4.6%),46.9%)] focus:outline-none"
					name="username"
					v-model="username"
					placeholder="username" />
				<input
					class="border border-[hsl(218,calc(1*7.9%),23.7%)] px-4 py-2 rounded w-full bg-[hsl(218,calc(1*7.9%),27.3%)] placeholder:text-[hsl(218,calc(1*4.6%),46.9%)] focus:outline-none"
					name="email"
					v-model="email"
					placeholder="email" />
				<input
					class="border border-[hsl(218,calc(1*7.9%),23.7%)] px-4 py-2 rounded w-full bg-[hsl(218,calc(1*7.9%),27.3%)] placeholder:text-[hsl(218,calc(1*4.6%),46.9%)] focus:outline-none"
					name="password"
					type="password"
					v-model="password"
					placeholder="password" />
				<input type="submit" class="w-full bg-[#5865F2] py-2 px-4 rounded cursor-pointer" />
			</form>
			<div class="text-center">Or <nuxt-link class="hover:underline text-blue-500"
					to="/login">Login</nuxt-link></div>
		</div>
	</div>
</template>

<script lang="ts">
import { NuxtLink } from '~/.nuxt/components';
import { useGlobalStore } from '~/stores/store'
import { IUser } from '~/types';

definePageMeta({
	layout: 'clean'
})

export default {
	data() {
		return {
			username: '',
			email: '',
			password: ''
		}
	},
	methods: {
		async signup() {
			if (!this.username || !this.password || !this.email) return;
			const user = await $fetch('/api/signup', {
				method: 'post', body: {
					username: this.username,
					email: this.email,
					password: this.password
				}
			}) as { userId: string; token: string; user: IUser; }

			const userId = useCookie('userId')
			userId.value = user.userId
			const token = useCookie('sessionToken')
			token.value = user.token

			useGlobalStore().setUser(user.user)

			navigateTo('/channel/@me')
		}
	}
}
</script>