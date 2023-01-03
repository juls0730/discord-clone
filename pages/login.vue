<template>
	<form class="flex flex-col"
		@submit.prevent="signup()">
		<input class="border border-zinc-700"
			name="username"
			v-model="username"
			placeholder="username" />
		<input class="border border-zinc-700"
			name="password"
			type="password"
			v-model="password"
			placeholder="password" />
		<input type="submit" />
	</form>
</template>

<script>
import { useUserStore } from '~/stores/user'

export default {
	data() {
		return {
			username: '',
			password: ''
		}
	},
	methods: {
		async signup() {
			if (!this.username || !this.password) return;
			const user = await $fetch('/api/login', {
				method: 'post', body: {
					username: this.username,
					password: this.password
				}
			})

			const userId = useCookie('userId')
			userId.value = user.userId
			const token = useCookie('sessionToken')
			token.value = user.token

			useUserStore().setUser(user)
		}
	}
}
</script>