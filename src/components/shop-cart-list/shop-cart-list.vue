<template>
  <transition name="fade">
    <cube-popup
      v-show="visible"
      type="shop-cart-list"
      position="bottom"
      :mask-closable="true"
      :z-index=90
      @mask-click="hide"
    >
      <transition name="move" @after-leave="onLeave">
        <div v-show="visible">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty()">清空</span>
          </div>
          <cube-scroll class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="food in selectFoods" :key="food.name">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price * food.count}}</span>
                </div>
                <div class="cart-control-wrapper">
                  <cart-control @add="onAdd" :food="food"></cart-control>
                </div>
              </li>
            </ul>
          </cube-scroll>
        </div>
      </transition>
    </cube-popup>
  </transition>
</template>

<script type="text/ecmascript-6">
  import CartControl from '../cart-control/cart-control'

  const EVENT_HIDE = 'hide'
  const EVENT_LEAVE = 'leave'
  const EVENT_ADD = 'add'
  export default {
    name: 'shop-cart-list',
    props: {
      selectFoods: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        visible: false
      }
    },
    methods: {
      show() {
        this.visible = true
        // 每次加载都会重新渲染
        this.$nextTick(() => {
          this.$refs.listContent.refresh()
        })
      },
      hide() {
        this.visible = false
        this.$emit(EVENT_HIDE)
      },
      onLeave() {
        this.$emit(EVENT_LEAVE)
      },
      onAdd(target) {
        this.$emit(EVENT_ADD, target)
      },
      empty() {
       this.$createDialog({
          type: 'confirm',
          content: '确认清空购物车吗?',
          $events: {
            confirm: () => {
              this.selectFoods.forEach((food) => {
                food.count = 0
              })
              this.hide()
            }
          }
        }).show()
      }
    },
    components: {
      CartControl
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable.styl"
  .cube-shop-cart-list
    bottom: 48px
    &.fade-enter , &.fade-leave-active
      opacity: 0
    &.fade-enter-active , &.fade-leave-active
      transition: all .3s ease-in-out
    .move-enter , .move-leave-active
      transform: translate3d(0,100%,0)
    .move-enter-active , .move-leave-active
      transition: all .3s ease-in-out
    .list-header
      height: 40px
      padding: 0 18px
      background-color: #f3f5f7
      line-height: 40px
      .title
        float: left
        font-size: 14px
        font-weight: 200
        color: rgb(7,17,27)
        line-height: 40px
      .empty
        float: right
        font-size: 12px
        line-height: 40px
        color: rgb(0,160,220)
    .list-content
      background-color: #ffffff
      max-height: 217px
      overflow: hidden
      padding: 0 18px
      .food
        position: relative
        box-sizing: border-box
        padding: 12px 0
        .name
          font-size: 14px
          color: rgb(7,17,27)
          line-height: 24px
        .price
          position: absolute
          right: 90px
          bottom: 12px
          font-size: 14px
          font-weight: 700
          color: rgb(240,20,20)
          line-height: 24px
        .cart-control-wrapper
          position: absolute
          right: 0
          bottom: 6px
</style>
