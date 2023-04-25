import { SafeUser } from '~/types';

export const useUserStore = defineStore('userStore', {
	state: () => ({
		user: null as SafeUser | null,
		isLoggedIn: false,
	}),
	actions: {
		setUser(user: SafeUser) {
			this.user = user;
			this.isLoggedIn = true;
		},
		async logout() {
			await $fetch('/api/user/logout');
			useCookie('sessionToken').value = null;
			useCookie('userId').value = null;

			this.user = null;
			this.isLoggedIn = false;
			return navigateTo('/login');
		}
	}
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}