<template>
  <span>
    <!-- <i class="icon-bofangqi-suoping" @click="handleLock">锁屏</i> -->
     <span @click="handleLock"><svg-icon class-name='international-icon' icon-class="lock"/></span>
    <el-dialog :title="$t('toplock.SetupthePIN')" :visible.sync="box" width="40%" append-to-body>
      <el-form :inline="true" @submit.native.prevent :model="form" ref="form" label-position="left" label-width="180px" style='width: 400px; margin-left:50px;'>
        <el-form-item :label="$t('toplock.PIN')" prop="passwd" :rules="[{ required: true, message: this.$t('toplock.PINisnotallowedempty')}]">
          <el-input  style="width:300px;" v-model="form.passwd":placeholder="$t('toplock.PleaseinputthePIN')" @keyup.enter.native="handleSetLock"></el-input>

        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary"  @click.native.prevent="handleSetLock">{{$t('table.OK')}}</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
import { validatenull } from '@/utils/validate'
import { mapGetters } from 'vuex'
export default {
  name: 'top-lock',
  data() {
    return {
      box: false,
      form: {
        passwd: ''
      }
    }
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(['lockPasswd'])
  },
  props: [],
  methods: {
    handleSetLock() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_LOCK_PASSWD', this.form.passwd)
          this.handleLock()
        }
      })
    },
    handleLock() {
      if (validatenull(this.lockPasswd)) {
        this.box = true
        return
      }
      this.$store.commit('SET_LOCK')
      setTimeout(() => {
        this.$router.push({ path: '/lock' })
      }, 100)
    }
  }
}
</script>
