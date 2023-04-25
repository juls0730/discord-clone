export default defineNuxtRouteMiddleware(() => {
	if (useError().value?.message.trim().split(' ')[0]?.slice(1,4) === '401') return '/login';
	if (!useCookie('sessionToken').value) {
		return '/login';
	}
});
