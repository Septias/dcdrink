<template lang="pug">
main.flex.justify-center.items-center.h-screen
  div.max-size
    suspense
      router-view(:key="$route.fullPath")
</template>

<style lang="sass">
.max-size
  width: 100%
  height: 100%
  max-width: 800px
  max-height: 1200px
</style>
