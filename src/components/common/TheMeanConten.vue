<template>
  <div class="vMeanconten">
    <el-menu class="el-menu-vertical-demo" unique-opened>
      <el-row :gutter="gutterParment.gutter">
        <template v-for="item in routes">
          <template v-if="!item.hidden">
            <router-link :to="item.path">
              <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
                <div :class="['grid-content',item.meta.bgcolor]" @click="common_dialogVisible = true">

                  <img class="mean-img" :src="item.meta.meanimg">
                  <span class="mean-text">
                    {{ generateTitle(item.meta.title) }}
                  </span>
                </div>
              </el-col>
            </router-link>
          </template>
        </template>
      </el-row>
    </el-menu>
    <el-dialog name="common-dialog" :visible.sync="common_dialogVisible" width="68%" height="68%" top="8vh" :before-close="resetWindowDocumentTitle">
      <div class="common-dialog">
        <transition name="move" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { generateTitle } from '@/utils/i18n'
import {
  setTitle
} from '@/utils/util' // 设置浏览器头部标题
export default {
  name: 'TheMeanconten',
  data() {
    return {
      // 判断权限id
      role_code: '',
      // 菜单栅格间隔
      gutterParment: {
        gutter: 100
      },
      // 弹框是否显示
      common_dialogVisible: false
    }
  },
  props: {
    routes: {
      type: Array
    },
    // 菜单栅格间隔
    // gutter: {
    //   type: Number
    //   default: 100
    // },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  created() {
    var self = this
    self.role_code = this.$store.getters.roles
    if (self.role_code.includes(1)) {
      self.$set(self.gutterParment, 'gutter', 100)
    } else if (self.role_code.includes(2)) {
      self.$set(self.gutterParment, 'gutter', 300)
    } else if (self.role_code.includes(4) || self.role_code.includes(5) || self.role_code.includes(6)) {
      self.$set(self.gutterParment, 'gutter', 460)
    } else if (self.role_code.includes(7) || self.role_code.includes(8) || self.role_code.includes(10)) {
      self.$set(self.gutterParment, 'gutter', 880)
    }
  },
  methods: {
    generateTitle,
    // 重置浏览器头部标题
    resetWindowDocumentTitle(done) {
      // 设置浏览器头部标题
      const browserHeaderTitle = ''// 为空就是默认
      setTitle(browserHeaderTitle)
      done()
    }
  }
}
</script>

<style lang='scss' scoped>
.vMeanconten{
  background-image: url('../../assets/images/home/MDMbg.png'); //此为背景图片地址
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  -webkit-background-size: 100% 100%;
  height: 1041px;
  width: 100%;
}
/* 如果不设置下面的befor则背景图片失效 */
.el-menu::after, .el-menu::before {
  content:none;
}
.el-progress-bar__inner::after, .el-row::after, .el-row::before, .el-slider::after, .el-slider::before, .el-slider__button-wrapper::after, .el-upload-cover::after {
 content:none;
}
 @media screen and (min-width: 801px) and (max-width: 1400px) {
.el-row {
  margin: 0px 8% !important;
}

}
 @media screen and (min-width: 1400px) {
.el-row {
  margin: 0px 20% !important;
}

}
.el-col {
  border-radius: 4px;
  height: 80px;
  margin-top: 80px;
}
.grid-content {
  position: relative;
  color: white;
  // width: 148px;
  width: 188px;
  margin: 20px 20px;
  border-radius: 4px;
  height: 86px;
  cursor: pointer;
}
.mean-text {
  position: absolute;
  top: 30px;
  margin-left: 20px;
  font-size: 18px;
}
/* bg-color */
.bg {
  &-client {
    background-color: #a792f4;
    &:hover {
      background-color: #7c5df0;
    }
  }
  &-user {
    background-color: #f5c121;
    &:hover {
      background-color: #e9b104;
    }
  }
  &-device {
    background-color: #57cec1;
    &:hover {
      background-color: #25c4b3;
    }
  }
  &-behavior {
    background-color: #99d953;
    &:hover {
      background-color: #7abc31;
    }
  }
  &-content {
    background-color: #70c6ee;
    &:hover {
      background-color: #2ca4dc;
    }
  }
  &-check {
    background-color: #e37a50;
    &:hover {
      background-color: #d05f33;
    }
  }
  &-push {
    background-color: #fda442;
    &:hover {
      background-color: #df8828;
    }
  }
  &-system {
    background-color: #6297de;
    &:hover {
      background-color: #427ac5;
    }
  }
}
/* mean-img */
.mean-img {
  margin-left: 20px;
  height: 80px;
}
/* dialog */
.common-dialog {
  margin-top: -36px;
  height:726px;
}
</style>
