<template>
  <div>
    <!-- header -->
    <v-header v-bind:seller="seller"></v-header>
    <div class="tab">
      <div class="tab-item border-1px">
        <router-link v-bind:to="'/goods'">
          商品
        </router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">
          评论
        </router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">
          商家
        </router-link>
      </div>
    </div>
    <!-- header -->
      <router-view></router-view>
  </div>
</template>

<script>
import vHeader from './components/header/header'

const ERR_OK = 0

export default {
  data(){
    return {
      seller: {}
    }
  },
  created(){
    this.$http.get('/api/seller').then((response) => {
      // get body data
      response = response.body
      if (response.errno === ERR_OK){
        this.seller = response.data
      }
    }, response => {
      // error call back
    })
  },
  components: {
    vHeader
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import './common/stylus/mixin.styl'

    .tab
      display: flex
      width: 100%
      line-height: 40px
      border-1px(rgba(7, 17, 27, 0.1))
      .tab-item
        flex: 1
        text-align: center

        & > a
          display: block
          font-size: 14px
          color: rgb(77, 85, 93)
          &.active
            color: rgb(240, 20, 20)
</style>
