<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,

import { api } from './api'

// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'DcDrink',
  meta: [
    {
      name: 'theme-color',
      content: computed(() => isDark.value ? '#00aba9' : '#ffffff'),
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: computed(() => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg'),
    },
  ],
})

document.addEventListener('keydown', (key) => {
  if (key.key === 's') {
    console.log('reset serial')
    api.last_serial = 0
  }
})
</script>

<template>
  <RouterView />
</template>
