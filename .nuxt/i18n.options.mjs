
// @ts-nocheck


export const localeCodes =  [
  "en-US",
  "fr-FR",
  "sv-SV",
  "th-TH"
]

export const localeLoaders = {
  "en-US": [{ key: "../locales/en-US.json", load: () => import("../locales/en-US.json" /* webpackChunkName: "locale__Users_heathcliff_Downloads_devsite_locales_en_US_json" */), cache: true }],
  "fr-FR": [{ key: "../locales/fr-FR.json", load: () => import("../locales/fr-FR.json" /* webpackChunkName: "locale__Users_heathcliff_Downloads_devsite_locales_fr_FR_json" */), cache: true }],
  "sv-SV": [{ key: "../locales/sv-SE.json", load: () => import("../locales/sv-SE.json" /* webpackChunkName: "locale__Users_heathcliff_Downloads_devsite_locales_sv_SE_json" */), cache: true }],
  "th-TH": [{ key: "../locales/th-TH.json", load: () => import("../locales/th-TH.json" /* webpackChunkName: "locale__Users_heathcliff_Downloads_devsite_locales_th_TH_json" */), cache: true }]
}

export const vueI18nConfigs = [
  
]

export const nuxtI18nOptions = {
  "restructureDir": "i18n",
  "experimental": {
    "localeDetector": "",
    "switchLocalePathLinkSSR": false,
    "autoImportTranslationFunctions": false,
    "typedPages": true,
    "typedOptionsAndMessages": false,
    "generatedLocaleFilePathFormat": "absolute",
    "alternateLinkCanonicalQueries": false
  },
  "bundle": {
    "compositionOnly": true,
    "runtimeOnly": false,
    "fullInstall": true,
    "dropMessageCompiler": false,
    "optimizeTranslationDirective": true
  },
  "compilation": {
    "jit": true,
    "strictMessage": true,
    "escapeHtml": false
  },
  "customBlocks": {
    "defaultSFCLang": "json",
    "globalSFCScope": false
  },
  "vueI18n": "",
  "locales": [
    {
      "code": "en-US",
      "name": "English",
      "files": [
        "/Users/heathcliff/Downloads/devsite/locales/en-US.json"
      ]
    },
    {
      "code": "fr-FR",
      "name": "Français",
      "files": [
        "/Users/heathcliff/Downloads/devsite/locales/fr-FR.json"
      ]
    },
    {
      "code": "sv-SV",
      "name": "Svenska",
      "files": [
        "/Users/heathcliff/Downloads/devsite/locales/sv-SE.json"
      ]
    },
    {
      "code": "th-TH",
      "name": "ไทย",
      "files": [
        "/Users/heathcliff/Downloads/devsite/locales/th-TH.json"
      ]
    }
  ],
  "defaultLocale": "en-US",
  "defaultDirection": "ltr",
  "routesNameSeparator": "___",
  "trailingSlash": false,
  "defaultLocaleRouteNameSuffix": "default",
  "strategy": "prefix_except_default",
  "lazy": true,
  "langDir": "../locales",
  "detectBrowserLanguage": {
    "alwaysRedirect": false,
    "cookieCrossOrigin": false,
    "cookieDomain": null,
    "cookieKey": "i18n_redirected2",
    "cookieSecure": false,
    "fallbackLocale": "",
    "redirectOn": "root",
    "useCookie": true
  },
  "differentDomains": false,
  "baseUrl": "",
  "customRoutes": "page",
  "pages": {},
  "skipSettingLocaleOnNavigate": false,
  "types": "composition",
  "debug": false,
  "parallelPlugin": false,
  "multiDomainLocales": false,
  "i18nModules": []
}

export const normalizedLocales = [
  {
    "code": "en-US",
    "name": "English",
    "files": [
      {
        "path": "/Users/heathcliff/Downloads/devsite/locales/en-US.json"
      }
    ]
  },
  {
    "code": "fr-FR",
    "name": "Français",
    "files": [
      {
        "path": "/Users/heathcliff/Downloads/devsite/locales/fr-FR.json"
      }
    ]
  },
  {
    "code": "sv-SV",
    "name": "Svenska",
    "files": [
      {
        "path": "/Users/heathcliff/Downloads/devsite/locales/sv-SE.json"
      }
    ]
  },
  {
    "code": "th-TH",
    "name": "ไทย",
    "files": [
      {
        "path": "/Users/heathcliff/Downloads/devsite/locales/th-TH.json"
      }
    ]
  }
]

export const NUXT_I18N_MODULE_ID = "@nuxtjs/i18n"
export const parallelPlugin = false
export const isSSG = false
export const hasPages = true

export const DEFAULT_DYNAMIC_PARAMS_KEY = "nuxtI18nInternal"
export const DEFAULT_COOKIE_KEY = "i18n_redirected"
export const SWITCH_LOCALE_PATH_LINK_IDENTIFIER = "nuxt-i18n-slp"
