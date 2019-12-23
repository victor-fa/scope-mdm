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
  width: 100%;
  margin: 26px;
  font-size: 28px;
  color: #379892;
}
/* login-modal */
.login-modal {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 484px;
  height: 330px;
  margin: -160px 36% 0 -236px;
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
  padding-left: 70px;
}
/* form-item */
.el-form-item {
  /* margin: 13px 46px; */
  color: #454545;
  font-size: 20px;
}

/* input */
.input-border {
  border-radius: 5px;
}

.el-input {
  width: 100%;
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
</style>

<template>
  <div class="login-all">
    <div class="login-all-title"><img src="../../assets/images/login/login-logo.png"  alt="logo"  style="vertical-align: middle;" />&nbsp; {{$t('login.title')}}</div>
    <div class="login-modal">
       <lang-Select class="right-menu-item" style="background-color:#292929"></lang-Select>
      <div class="login-modal-title"> {{$t('RetrievePassword.Resetpassword')}}
      </div>
      <el-form  :model="loginForm" :rules="rules" ref="loginForm" label-position="left" label-width="210px">
        <el-form-item prop="newpassword"  :label="$t('RetrievePassword.Newpassword')" class="input-border">
          <el-input class="input" name="newpassword" type="text" v-model="loginForm.newpassword" :placeholder="$t('RetrievePassword.Newpassword')"  autofocus="autofocus" autoComplete="on" />
        </el-form-item>
        <el-form-item prop="password"  :label="$t('RetrievePassword.Confirmpassword')" class="input-border">
          <el-input class="input" :type="pwdType" name="password"  v-model="loginForm.password"  :placeholder="$t('RetrievePassword.Confirmpassword')" autoComplete="on" autofocus="autofocus"></el-input>
        <span class="show-pwd" @click="showPwd">
          <!-- <svg-icon icon-class="eye" /> -->
        <svg-icon v-if="this.pwdType === 'password'" icon-class="eye" />
        <svg-icon v-else icon-class="WithEyesOpen" />
        </span>
        </el-form-item>

        <el-form-item>
          <el-button class="button" type="primary" style="width:100%;height:50px;font-size:20px;" :loading="loading" @click.native.prevent="updatePassword">
            {{$t('RetrievePassword.OK')}}
          </el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>
<script>
import { user_updatePassword } from '@/api/user/user'

import md5 from 'js-md5'
export default {
  data() {
    const validatenewpassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('RetrievePassword.Pleaseinputthenewpassword')))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('RetrievePassword.Pleasereinputthenewpassword')))
      } else {
        if (value !== this.loginForm.newpassword) {
          callback(new Error(this.$t('RetrievePassword.Thetwopasswordsyouenteredisinconsistentpleaseenteragain')))
        }
        callback()
      }
    }
    return {
      pwdType: 'password', // 显示隐藏密码

      // 重置密码参数
      loginForm: {
        reset_password: '',
        password: '',
        newpassword: ''
      },

      // 重置密码非空验证
      rules: {
        newpassword: [
          {
            required: true,
            trigger: 'blur',
            validator: validatenewpassword
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
  created() {
    this.loginForm.reset_password = this.$route.params.token
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
    // 重置按钮事件
    resetpassword() {
      this.$refs['loginForm'].resetFields()
    },
    // 修改密码
    updatePassword() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loginForm.password = md5(this.loginForm.password)
          user_updatePassword(this.loginForm).then(response => {
            if (response.errorCode === 0) {
              this.$message.success(this.$t('message.Editsuccessed'))
              this.$router.push('/Login')
            } else {
              this.$message.error(this.$t('RetrievePassword.Thepagedoesntexistpleasecheckit'))
              this.resetpassword()
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
$dark_gray:#889aa4;
.show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
 
  /*right-menu-item*/
  .right-menu-item {
  position: absolute;
  top: 22px;
  right: 46px;
  display: inline-block;
}
/* login-all-title */
.login-all-title {
  position: absolute;
  width: 100%;
  margin: 26px;
  font-size: 28px;
  color: #379892;
}

</style>

