
<template>
  <div class="login-all">
    <div class="login-all-title">
      <img src="../../assets/images/login/login-logo.png" alt="logo" style="vertical-align: middle;" />&nbsp; {{$t('login.title')}}</div>
    <div class="login-modal">
      <lang-Select class="right-menu-item" style="background-color:#292929"></lang-Select>
      <div class="login-modal-title"> {{$t('login.UserLogin')}}

      </div>
      <el-form autoComplete="on" :model="loginForm" :rules="rules" ref="loginForm" label-position="left">
        <el-form-item prop="username" class="input-border">
          <span class="svg-container">
            <svg-icon icon-class="user"/>
          </span>
          <el-input name="username" type="text" v-model="loginForm.username" :placeholder="$t('login.Account')" autofocus="autofocus" @keyup.enter.native="handleLogin" />
        </el-form-item>
        <el-form-item prop="password" class="input-border">
          <span class="svg-container">
            <svg-icon icon-class="password"></svg-icon>
          </span>
          <el-input :type="pwdType" name="password" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" :placeholder="$t('login.Password')"></el-input>
          <span class="show-pwd" @click="showPwd">
            <svg-icon v-if="this.pwdType === 'password'" icon-class="eye"/>
            <svg-icon v-else icon-class="WithEyesOpen"/>
          </span>
        </el-form-item>

        <el-form-item>
          <!-- `checked` 为 true 或 false -->
          <el-checkbox v-model="checked" class="password_save">{{$t('login.Rememberme')}}</el-checkbox>
          <label style="color:#21baa9;padding-left:100px;">
            <strong @click="userRetrivevPassword">{{$t('login.Findpassword')}}</strong>
          </label>
          <el-button type="primary" style="width:100%;margin-top:10px;height:50px;font-size:24px;" :loading="loading" @click.native.prevent="handleLogin">
            {{$t('login.Login')}}
          </el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>
<script>
import md5 from 'js-md5'
import { user_retrivevPassword } from '@/api/user/user'
import { retrievePasswordError } from '@/utils/response'
export default {
  name: 'login',

  data() {
    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('login.PleaseinputtheUserName')))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error(this.$t('login.Shouldbelargerthan3letters')))
      } else {
        callback()
      }
    }
    return {
      pwdType: 'password', // 显示密码属性

      checked: true, // 默认勾选记住密码

      // 登入参数
      loginForm: {
        username: '10001',
        password: '123'
      },

      login_account: '', // 账号

      // 登入非空验证
      rules: {
        username: [
          {
            required: true,
            trigger: 'blur',
            validator: validateUsername
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePass
          }
        ]
      },
      loading: false
    }
  },
  mounted() {
    this.getCookie()
  },
  methods: {
    // 显示隐藏密码方法
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    // 找回密码
    userRetrivevPassword() {
      if (this.loginForm.username === '') {
        this.$message.error(this.$t('login.Pleaseinputtheaccount'))
        return false
      }
      user_retrivevPassword(this.loginForm.username).then(response => {
        if (response.errorCode === 0) {
          this.$message.success(this.$t('login.ThenewpasswordresetlinkhassenttoyourEmail'))
        } else if (response.errorCode === 10) {
          retrievePasswordError(response.errorMessage)
        // } else {
        //   this.$message.error(response.errorMessage)
        // }
        }
      })
    },

    // 登入方法
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 判断复选框是否被勾选 勾选则调用配置cookie方法
          if (this.checked === true) {
            // 传入账号名，密码，和保存天数3个参数
            this.setCookie(this.loginForm.username, 7)
          } else {
            // 清空Cookie
            this.clearCookie()
          }
          this.loading = true
          var userInfo = {}
          userInfo.login_account = this.loginForm.username
          // MD5密码加密
          userInfo.password = md5(this.loginForm.password)
          userInfo.remark = this.checked === true ? 'autologin' : 'nocheck'
          this.$store.dispatch('Login', userInfo)
            .then(() => {
              localStorage.setItem('ms_username', this.loginForm.username)
              this.$router.push('/home')
            })
            .catch(() => {
              this.loading = false
            })
          // this.$axios
          //   .post(
          //     '/user/login',
          //     this.$qs.stringify({
          //       login_account: this.loginForm.username,

          //       password: this.loginForm.password,

          //       remark: this.checked === true ? 'autologin' : 'nocheck'
          //     })
          //   )
          //   .then(function(response) {
          //     this.loading = false
          //     localStorage.setItem('ms_username', this.loginForm.username)
          //     this.$router.push('/home')
          //   })
          //   .catch(() => {
          //     this.loading = false
          //   })
        } else {
          return false
        }
      })
    },
    // 设置cookie
    setCookie(c_name, exdays) {
      var exdate = new Date() // 获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) // 保存的天数
      // 字符串拼接cookie
      window.document.cookie =
        'userName' + '=' + c_name + ';path=/;expires=' + exdate.toGMTString()
    },
    // 读取cookie
    getCookie() {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split('; ') // 这里显示的格式需要切割一下自己可输出看下
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split('=') // 再次切割
          // 判断查找相对应的值
          if (arr2[0] === 'userName') {
            this.loginForm.username = arr2[1] // 保存到保存数据的地方
          }
        }
      }
    },
    // 清除cookie
    clearCookie() {
      this.setCookie('', -1) // 修改2值都为空，天数为负1天就好了
    }
  }
}
</script>

<style scoped>
/* login-all */
.login-all {
  font-family: YouYuan !important;
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url('../../assets/images/login/login-bg.png');
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  -webkit-background-size: 100% 100%;
}
/* login-all-title */
.login-all-title {
  position: absolute;
  top: 50%;
  width: 100%;
  margin-top: -260px;
  text-align: center;
  font-size: 28px;
  color: #379892;
}
/* login-modal */
.login-modal {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 484px;
  height: 398px;
  margin: -160px 36% 0 -236px;
  background-image: url('../../assets/images/login/login-bg_center.png');
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  -webkit-background-size: 100% 100%;
}
/* login-title */
.login-modal-title {
  margin-top: 22px;
  text-align: center;
  font-size: 24px;
  color: #626363;
  padding-bottom: 20px;
}
/* form-item */
.el-form-item {
  margin: 18px 46px;
  color: #454545;
  font-size: 20px;
}
/* ico */
.svg-container {
  font-size: 46px;
  padding: 6px 26px 6px 5px;
  vertical-align: middle;
  width: 20px;
  display: inline-block;
}
/* input */
.input-border {
  border: 1px solid #82cebf;
  border-radius: 5px;
  box-sizing: border-box;
}

input:focus {
  border-left: 1px solid #379892 !important;
}
input:hover {
  border-left: 1px solid #379892 !important;
}
.el-input {
  width: 85%;
}
/* login-button */
.el-button--primary {
  background-color: #21baa9;
  border-color: #21baa9;
}
.el-button--primary:hover {
  background-color: #379892;
  border-color: #379892;
}
.el-button--primary:focus,
.el-button--primary:hover {
  background-color: #379892;
  border-color: #379892;
  color: #fff;
}
.right-menu-item {
  position: absolute;
  top: 22px;
  right: 46px;
  display: inline-block;
}
.show-pwd {
  position: absolute;
  right: 10px;
  top: 7px;
  font-size: 16px;
  color: #889aa4;
  cursor: pointer;
  user-select: none;
}
</style>

