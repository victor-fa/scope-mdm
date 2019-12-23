<template>
  <div class="foot">
    <h3 class="foot-copyright">{{$t('foot.copyright')}}</h3>
  </div>
</template>

<script>
export default {
  name: 'the-Foot',
  data() {
    return {}
  },

  computed: {},

  methods: {

  }
}
</script>
<style lang='scss' scoped>
/* foot */
.foot {
  position: absolute;
  padding: 20px 0 20px 0;
  width: 100%;
  border: 1px solid hsla(0, 0%, 100%, 0.1);
  background: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  color: #454545;
  bottom: 0px !important;
}
.foot-copyright {
  text-align: center;
  color: #666666;
  opacity: 0.5;
}
</style>