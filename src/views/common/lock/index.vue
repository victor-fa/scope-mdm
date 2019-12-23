<template>
  <div class="lock-container pull-height">
    <div class="lock-form animated bounceInDown">
      <div class="animated" :class="{'shake':passwdError,'bounceOut':pass}">
        <h3 class="text-white">{{name}}</h3>
        <el-input style="width:400px;" :placeholder="$t('toplock.PleaseinputthePIN')" type="password" class="input-with-select animated" v-model="passwd" @keyup.enter.native="handleLogin">
          <!-- <el-button slot="append" icon="icon-bofangqi-suoping" @click="handleLogin"></el-button>
          <el-button slot="append" icon="icon-tuichu" @click="handleLogout"></el-button> -->
          <el-button slot="append" @click="handleLogin"><svg-icon  class-name='international-icon' icon-class="deblocking"/></el-button>
          <el-button slot="append" @click="handleLogout"><svg-icon class-name='international-icon' icon-class="lock-out"/></el-button>
        </el-input>
      </div>

    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'lock',
  data() {
    return {
      passwd: '',
      passwdError: false,
      pass: false
    }
  },
  created() {},
  mounted() {},
  computed: {
    ...mapState({
      name: state => state.user.name
    }),
    ...mapGetters(['lockPasswd'])
  },
  props: [],
  methods: {
    handleLogout() {
      this.$confirm(this.$t('toplock.Doyouwanttologout'), this.$t('message.Notification'), {
        confirmButtonText: this.$t('message.OK'),
        cancelButtonText: this.$t('message.Cancel'),
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('FedLogOut').then(() => {
          this.$router.push({ path: '/login' })
        })
      }).catch(() => {
        return false
      })
    },
    handleLogin() {
      if (this.passwd !== this.lockPasswd) {
        this.passwd = ''
        this.$message({
          message: this.$t('toplock.PINisincorrectpleaseinputitagain'),
          type: 'error'
        })
        this.passwdError = true
        setTimeout(() => {
          this.passwdError = false
        }, 1000)
        return
      }
      this.pass = true
      setTimeout(() => {
        this.$store.commit('CLEAR_LOCK')
        this.$router.push('/home')
      }, 1000)
    }
  }

}
</script>

<style lang="scss">
.lock-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.lock-container::before {
  z-index: -999;
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: url("../../../assets/images/home/lockLogin.png");
  background-size: cover;
}
.lock-form {
  width: 300px;
}
</style>