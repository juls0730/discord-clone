export default defineNuxtRouteMiddleware(() => {
	if (useError().value?.message.trim().split(' ')[0]?.slice(1,4) === '401') return navigateTo('/login');
	if (!useCookie('sessionToken').value) {
		return navigateTo('/login');
	}
});
