// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon', '@nuxtjs/i18n'],
  plugins: [
    // ... other plugins
    '~/plugins/rippleBackground.js'
  ],
  future:{
    compatibilityVersion: 4
  },
  i18n: {
    locales: [
      {
        code: 'en-US',
        name: 'English',
        file: 'en-US.json',
      },
      {
        code: 'fr-FR',
        name: 'Français',
        file: 'fr-FR.json',
      },
      {
        code: 'sv-SV',
        name: 'Svenska',
        file: 'sv-SE.json',
      },
      {
        code: 'th-TH',
        name: 'ไทย',
        file: 'th-TH.json',
      },
    ],
    lazy: true,
    langDir: '../locales',
    defaultLocale: 'en-US',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected2',
      redirectOn: 'root',
    },
  },
});
