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

	devtools: {
		enabled: true,
	},

	modules: [
		[
			'@pinia/nuxt',
			{
				autoImports: [
					// automatically imports `defineStore`
					'defineStore', // import { defineStore } from 'pinia'
					'storeToRefs',
					// automatically imports `defineStore` as `definePiniaStore`
					['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
				],
			},
		],
		'@nuxt/devtools',
	],

	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
});
