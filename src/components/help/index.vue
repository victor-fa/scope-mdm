<template>
  <div>
    <el-tooltip effect="dark" content="疑问" placement="bottom">
      <el-button class=" btn-text can-hover" type="text" @click="dialogVisible = true">
       ?
      </el-button>
    </el-tooltip>
    <el-dialog :title="$t('FourOFour.Help')" width="700px" :visible.sync="dialogVisible" append-to-body>
      <div style="margin-top: -25px;">
        <h1>{{$t('FourOFour.Forexamplewwwqqcomonlyneedstofillintheqqandverifytheerror')}}</h1>
        <!-- <el-row :gutter="20">
          <el-col :span="12">
            <el-alert :closable="false" type="info" title="扫码进 QQ 群"/>
            <img class="qr" src="../../../static/img/me/qq.jpg">
          </el-col>
          <el-col :span="12">
            <el-alert :closable="false" type="info" title="作者微信 加好友拉进微信群" />
            <img class="qr" src="../../../static/img/me/we.jpg">
          </el-col>
        </el-row> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'help',
  data() {
    return {
      dialogVisible: false
    }
  }
}
</script>

<style lang="scss" scoped>
img {
  &.qr {
    width: 100%;
  }
}
 .btn-text {
        color:#00162D;
        &.can-hover {
          &:hover {
            color: #FFEBA4;
            background-color: #00162D;
          }
        }
      }

</style>
