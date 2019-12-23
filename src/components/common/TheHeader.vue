<template>
  <div>
    <el-menu class="header" :style="{ 'background-color': primaryColor }">
      <div class="logo"></div>
      <div class="logo-title"> {{$t('navbar.title')}}</div>
      <div class="user-info">
        <span class="right-menu-item">{{username}}</span>
        <img class="user-logo right-menu-item" src="../../assets/images/home/dog.jpg">
        <lang-Select class="right-menu-item"></lang-Select>
        <skinComp class="right-menu-item"></skinComp>
       <top-lock class="right-menu-item"></top-lock>
        <span class="svg-container right-menu-item" @click="logout()">
          <!-- <svg-icon icon-class="login-out" /> -->
          <img v-if="this.ifShowLogOut===4" src="../../assets/images/home/login-out.png" class="login-out-png" @mouseenter="mousemoveOutImg()" />
          <img v-if="this.ifShowLogOut===6" src="../../assets/images/home/login-out-hover.png" class="login-out-png" @mouseleave="mouseleaveOutImg()" />
        </span>
      </div>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: 'the-Header',

  data() {
    return {
      primaryColor: '#21baa9',
      name: 'nxmin',
      // 是否显示log-out图片，morning显示
      ifShowLogOut: 4
    }
  },
  created() {
    // 加载用户 Header主题
    if (localStorage.getItem('themeValue')) {
      switch (localStorage.getItem('themeValue')) {
        case 'blue':
          /* eslint-disable */
          this.primaryColor = '#409eff'
          break
        case 'Green':
          this.primaryColor = '#009a61'
          break
        case 'Red':
          this.primaryColor = '#f44336'
          break
        case 'Purple':
          this.primaryColor = '#7B7DE5'
          break
        default:
          this.primaryColor = '#21baa9'
          break
      }
    } else {
      this.primaryColor = '#21baa9'
    }
  },
  computed: {
    username() {
      const username = localStorage.getItem('ms_username')
      return username || this.name
    }
  },
  methods: {
    // 鼠标悬浮切换退出图片
    mousemoveOutImg() {
      this.ifShowLogOut = 6
    },
    // 鼠标悬浮切换退出图片
    mouseleaveOutImg() {
      this.ifShowLogOut = 4
    },
    logout() {
      // this.$confirm('确认退出?', '提示', {
      //   type: 'warning'
      // }).then(() => {
      localStorage.removeItem('ms_username')
      this.$store.dispatch('FedLogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
      // })
    }
  }
}
</script>
<style lang="scss" scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  line-height: 70px;
  color: #fff;
  // background-color: #21baa9;
}
.header .logo {
  background-image: url('../../assets/images/home/home-log.png');
  height: 46px;
  width: 46px;
  float: left;
  margin-left: 30px;
  margin-top: 10px;
}
.logo-title {
  font-family: YouYuan !important;
  float: left;
  padding-left: 20px;
}
.user-info {
  float: right;
  padding-right: 30px;
  font-size: 16px;
  height: 70px;
}
@media only screen and (max-width: 800px) {
  .header .logo {
    margin-left: 0;
  }
  .logo-title {
    padding-left: 2px;
    font-size: 16px;
  }
  .user-info {
    padding-right: 0;
  }
}
.right-menu-item {
  display: inline-block;
  margin: 0 8px;
}
.user-info .user-logo {
  margin-top: -5px;
  vertical-align: middle;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.login-out-png{
  padding-left: 54px;
  margin-top: -16px;
  vertical-align: middle;
}
/* ico */
.svg-container {
  cursor: pointer;
  font-size: 28px;
  padding: 5px 0px 5px 5px;
  vertical-align: middle;
  display: inline-block;
}
</style>
