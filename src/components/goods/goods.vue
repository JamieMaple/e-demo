<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="(item, index) in goods" class="menu-item" v-bind:class="{'current': index===currentIndex}" @click='selectMenu(index, $event)'>
            <span class="text border-1px">
              <span v-show="item.type>0" class="icon" v-bind:class="classMap[item.type]"></span>
              {{ item.name }}
            </span>
          </li>
        </ul>
      </div>
      <div class="food-wrapper" ref="foodsWrapper">
        <ul>
          <li v-for="item in goods" class="food-list food-list-hook">
            <h1 class="title">{{ item.name }}</h1>
            <ul>
              <li @click="selectFood(food, $event)" v-for="food in item.foods" class="food-item border1px">
                <div class="icon">
                  <img width="57" height="57" v-bind:src="food.icon" alt="">
                </div>
                <div class="content">
                  <h2 class="name">{{ food.name }}</h2>
                  <p class="desc">{{ food.description }}</p>
                  <div class="extra">
                    <span class="count">月售{{ food.sellCount }}份</span>
                    <span>好评率{{ food.rating }}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span v-show="food.oldPrice" class="old">￥{{ food.oldPrice }}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol v-on:add="addFood" v-bind:food="food"></cartcontrol>
                  </div>
                </div>

              </li>
            </ul>
          </li>
        </ul>
      </div>
      <shopcart ref="shopcart" v-bind:delivery-price="seller.deliveryPrice" v-bind:min-price="seller.minPrice" v-bind:select-foods="selectFoods"></shopcart>
    </div>
      <food v-bind:food="selectedFood" ref="food" @add="addFood"></food>
  </div>
</template>

<script>
import shopcart from '../shopcart/shopcart'
import food from '../food/food'

import cartcontrol from '../cartcontrol/cartcontrol'

import BScroll from 'better-scroll'

const ERR_OK = 0

export default {
  props: { seller: Object },
  created(){
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']

    this.$http.get('/static/data.json').then((response) => {
      response = response.body
      if (response.goods){
        this.goods = response.goods
        // 优化体验
        this.$nextTick(() => {
          this._initScroll()
          this._calculateHeight()
        })
      }
    })
  },
  data(){
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    }
  },
  computed: {
    currentIndex() {
      for(let i = 0; i < this.listHeight.length; i++){
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)){
          return i
        }
      }
      return 0
    },
    selectFoods() {
      let foods = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count > 0){
            foods.push(food)
          }
        })
      })

      return foods
    }
  },
  methods: {
    selectMenu(index, event){
      if (!event._constructed){
        return
      }
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let el = foodList[index]

      this.foodsScore.scrollToElement(el, 300)
    },
    addFood(target){
      this._drop(target)
    },
    _drop(target){
      this.$nextTick(() => {
        this.$refs.shopcart.drop(target)
      })
    },
    selectFood(food, event){
      if (!event._constructed){
        return
      }
      this.selectedFood = food,
      this.$refs.food.show()
    },
    _initScroll(){
      this.menuWrapper = new BScroll(this.$refs.menuWrapper, {
        click: true
      })

      this.foodsScore = new BScroll(this.$refs.foodsWrapper, {
        click: true,
        probeType: 3
      })

      this.foodsScore.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    _calculateHeight(){
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++){
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  components: {
    shopcart, cartcontrol, food
  }
}
</script>

<style lang="stylus">
@import '../../common/stylus/mixin'
  .goods
    display flex
    position absolute
    width 100%
    top 174px
    bottom 46px
    overflow hidden
    .menu-wrapper
      flex 0 0 80px
      width 80px
      background #f3f5f7
      .menu-item
        display table
        height 54px
        width 56px
        padding 0 12px
        line-height 14px
        &.current
          position relative
          margin-top -1px
          z-index 10
          background #fff
          font-weight 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display table-cell
          width 56px
          vertical-align middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size 12px

    .food-wrapper
      flex 1
      .title
        padding-left 14px
        height 26px
        line-height 26px
        border-left 3px solid #d9dde1
        font-size 12px
        color rgb(147, 153, 159)
        background #f3f5f7
      .food-item
        display flex
        margin 18px
        padding-bottom 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex 0 0 57px
          margin-right 10px
        .content
          flex 1
          .name
            margin 2px 0 8px 0
            height 14px
            line-height 14px
            font-size 14px
            color rgb(7, 17, 27)
          .desc, .extra
            line-height 10px
            font-size 10px
            color rgb(147, 153, 159)
          .desc
            line-height 12px
            margin-bottom 8px
          .extra
            .count
              margin-right 12px
          .price
            font-weight 700
            line-height 24px
            .now
              margin-right 8px
              font-size 14px
              color rgb(240, 20, 20)
            .old
              text-decoration line-through
              font-size 10px
              color rgb(7, 17, 27)
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 12px

</style>
