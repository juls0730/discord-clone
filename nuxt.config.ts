// https://v3.nuxtjs.org/api/configuration/nuxt.config

export default defineNuxtConfig({
	ssr: true,

	app: {
		head: {
			meta: [
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' }
			],
		}
	},

	css: [
		'@/assets/css/main.css'
	],

	modules: [
		[
			'@pinia/nuxt',
			{
				autoImports: [
					'acceptHMRUpdate',
					'defineStore',
					'storeToRefs',
					['defineStore', 'definePiniaStore'],
				],
			},
		],
	],

	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
});
