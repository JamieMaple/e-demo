<template>
  <div>
    <!-- header -->
    <v-header v-bind:seller="seller"></v-header>
    <div class="tab">
      <div class="tab-item border-1px">
        <router-link to="/goods">
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
    <keep-alive>
      <router-view v-bind:seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import vHeader from './components/header/header'

import { urlParse } from './common/js/util'

import axios from 'axios'

const ERR_OK = 0

export default {
  data(){
    return {
      seller: {
        id: (() => {
          let queryParm = urlParse()
          return queryParm.id
        })()
      },
      goods: [],
      ratings: []
    }
  },
  created(){
    axios.get('static/data.json?id='+this.seller.id).then((res) => {
      res = res.data
      console.log(res);
      if (res.seller){
        this.seller = Object.assign({}, this.seller, res.seller)
      }
      if (res.goods){
        this.goods = res.goods
      }
      if (res.ratings){
        this.ratings = res.ratings
      }
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
