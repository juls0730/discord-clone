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
				function checkAuthStatus() {
					if(that.isLoggedIn === true) {
						resolve(true);
					}

					setTimeout(checkAuthStatus, 100);
				}
				checkAuthStatus();
			});
		},
	},
	actions: {
		setUser(user: SafeUser) {
			this.user = user;
			this.isLoggedIn = true;
		},
		removeFriendRequest(friendRequestId: string) {
			const type = (this.user?.incomingFriendRequests?.find((e) => e.id === friendRequestId)) ? 'incomingFriendRequests' : 'outgoingFriendRequests';

			this.user[type] = this.user[type].filter((e) => e.id !== friendRequestId);
		},
		async logout() {
			const { $io, $emit } = useNuxtApp();

			(await $io).disconnect();
			await $fetch('/api/user/logout');
			useCookie('sessionToken').value = null;

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