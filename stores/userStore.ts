import { SafeUser } from '~/types';

export const useUserStore = defineStore('userStore', {
	state: () => ({
		user: null as SafeUser | null,
		isLoggedIn: false,
	}),
	getters: {
		// computed property that returns a promise that resolves when the user logs in
		userLoggedIn() {
			// eslint-disable-next-line @typescript-eslint/no-this-alias
			const that = this;

			return new Promise<boolean>(resolve => {
				function checkFlag() {
					if(that.isLoggedIn === true) {
						resolve(true);
					}

					setTimeout(checkFlag, 100);
				}
				checkFlag();
			});
		},
	},
	actions: {
		setUser(user: SafeUser) {
			this.user = user;
			this.isLoggedIn = true;
		},
		async logout() {
			const { $io, $emit } = useNuxtApp();

			(await $io).disconnect();
			await $fetch('/api/user/logout');
			useCookie('sessionToken').value = null;
			useCookie('userId').value = null;

			this.user = null;
			this.isLoggedIn = false;

			$emit('userLogout', true);

			return navigateTo('/login');
		}
	}
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}