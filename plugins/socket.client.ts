import io from 'socket.io-client';
import { useUserStore } from '~/stores/userStore';

export default defineNuxtPlugin(() => {
	const { $listen } = useNuxtApp();

	async function initializeSocket() {
		await useUserStore().userLoggedIn;
		return io('http://localhost:3000', {
			auth: (cb) => cb({ token: useCookie('sessionToken').value })
		});
	}

	const socket = initializeSocket();
	
	$listen('userLogout', initializeSocket);

	return {
		provide: {
			io: socket
		}
	};
});