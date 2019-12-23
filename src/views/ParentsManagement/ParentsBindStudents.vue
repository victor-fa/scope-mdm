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
  padding-left: 56px;
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
      <div class="login-modal-title"> {{$t('ParentsBindStudents.ConnectChildren')}}
      </div>
      <el-form  :model="loginForm" :rules="rules" ref="loginForm" label-position="left" label-width="120px">
        <el-form-item prop="login_account" :label="$t('ParentsBindStudents.Account')" class="input-border">
          <el-input name="login_account" type="text" v-model="loginForm.login_account"  :placeholder="$t('ParentsBindStudents.Account')" autofocus="autofocus" />
        </el-form-item>
        <el-form-item prop="password" :label="$t('ParentsBindStudents.Password')" class="input-border">
          <el-input :type="pwdType" name="password"  v-model="loginForm.password"  :placeholder="$t('ParentsBindStudents.Password')" autoComplete="on"></el-input>
        <span class="show-pwd" @click="showPwd">
          <!-- <svg-icon icon-class="eye" /> -->
        <svg-icon v-if="this.pwdType === 'password'" icon-class="eye" />
        <svg-icon v-else icon-class="WithEyesOpen" />
        </span>
        </el-form-item>

        <el-form-item>
          <el-button  type="primary" style="width:100%;height:50px;font-size:20px;" :loading="loading" @click.native.prevent="parentBindingEquipment">
            {{$t('ParentsBindStudents.Connect')}}
          </el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>
<script>
import { user_parentBindingEquipment } from '@/api/user/user'
import { parentsBindStudentsError } from '@/utils/response'
import md5 from 'js-md5'
export default {

  data() {
    const validatlogin_account = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('ParentsBindStudents.Pleaseinputtheaccount')))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('ParentsBindStudents.Pleaseinputthepassword')))
      } else {
        callback()
      }
    }
    return {
      pwdType: 'password', // 显示隐藏密码属性

      // 绑定参数
      loginForm: {
        login_account: '',
        password: '',
        equipment_code: []
      },

      // 绑定非空验证
      rules: {
        login_account: [
          {
            required: true,
            trigger: 'blur',
            validator: validatlogin_account
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
    this.loginForm.equipment_code.push(this.$route.params.token)
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    // 家长绑定学生设备
    parentBindingEquipment() {
      var userInfo = {}
      // MD5密码加密
      userInfo.password = md5(this.loginForm.password)
      userInfo.login_account = this.loginForm.login_account
      userInfo.equipment_code = this.loginForm.equipment_code
      user_parentBindingEquipment(userInfo).then(response => {
        if (response.errorCode === 0) {
          this.$message.success(this.$t('ParentsBindStudents.Connectedsuccessed'))
        } else if (response.errorCode === 10) {
          parentsBindStudentsError(response.errorMessage)
        } else {
          this.$message.error(this.$t('ParentsBindStudents.InvalidURL'))
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
  top: 50%;
  width: 100%;
  margin-top: -260px;
  text-align: center;
  font-size: 28px;
  color: #379892;
}
</style>

