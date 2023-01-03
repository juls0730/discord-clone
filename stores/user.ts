export const useUserStore = defineStore('user', {
	state: () => ({
		user: {}
	}),
	actions: {
		setUser(user) {
			this.user = user;
		}
	},
})
