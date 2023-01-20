// https://v3.nuxtjs.org/api/configuration/nuxt.config

export default {
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


    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
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
        '@vueuse/nuxt',
    ],

    typescript: {
        strict: true
    }
}
