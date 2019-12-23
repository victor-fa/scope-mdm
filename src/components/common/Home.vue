<template>
  <div class="wrapper">
    <the-Header></the-Header>
    <div class="mdmContent">

      <the-Meanconten :routes="routes"></the-Meanconten>

    </div>
    <the-Foot></the-Foot>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      gutter: 300
    }
  },

  computed: {
    routes() {
      return this.$store.getters.routers
    }
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
</style>

