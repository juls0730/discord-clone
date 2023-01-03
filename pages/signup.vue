<template>
	<form class="flex flex-col"
		@submit.prevent="signup()">
		<input class="border border-zinc-700"
			name="username"
			v-model="username"
			placeholder="username" />
		<input class="border border-zinc-700"
			name="email"
			v-model="email"
			placeholder="email" />
		<input class="border border-zinc-700"
			name="password"
			type="password"
			v-model="password"
			placeholder="password" />
		<input type="submit" />
	</form>
</template>

<script>
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
			})

			const userId = useCookie('userId')
			userId.value = user.userId
			const token = useCookie('sessionToken')
			token.value = user.token
		}
	}
}
</script>