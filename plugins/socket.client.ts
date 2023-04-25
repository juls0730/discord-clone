import io from 'socket.io-client';

export default defineNuxtPlugin(() => {
	const socket = io('http://localhost:3000', {
		auth: (cb) => cb({ token: useCookie('sessionToken').value })
	});

	return {
		provide: {
			io: socket
		}
	};
});