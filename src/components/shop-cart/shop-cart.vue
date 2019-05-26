<template>
  <div class="shopcart" @click="showList()">
    <div class="content">
      <div class="content-left">
        <div class="logo-wrapper">
          <!--highlight是高光的意思，变得更亮-->
          <div class="logo" :class="{'highlight':totalCount > 0}">
            <i class="icon-shopping_cart" :class="{'highlight' :totalCount > 0}"></i>
          </div>
          <div class="num" v-show="totalCount >0">
            <!--用bubble组件是因为有两个地方需要用到方便-->
            <bubble :num="totalCount"></bubble>
          </div>
        </div>
        <div class="price" :class="{'highlight' :totalPrice > 0}">￥{{totalPrice}}</div>
        <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right">
        <div class="pay" @click.stop="pay()" :class="payClass">{{payDesc}}</div>
      </div>
    </div>
    <!--定义小球容器-->
    <div class="ball-container">
      <div v-for="(ball,index) in balls" :key="index">
        <transition
          @before-enter="beforeDrop"
          @enter="dropping"
          @after-enter="aferDrop"
        >
          <div class="ball" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Bubble from '../bubble/bubble'
  import axios from 'axios'

  // 定义球扔入的动画
  const BALL_LEN = 10
  const innerClsHook = 'inner-hook'
  // 创建小球
  function createBalls() {
    let ret = []
    for (let i = 0; i < BALL_LEN; i++) {
      ret.push({
        show: false
      })
    }
    return ret
  }

  export default {
    name: 'shopcart',
    props: {
      selectFoods: {
        type: Array,
        default() {
          return []
        }
      },
      // 配送费
      deliveryPrice: {
        type: Number,
        default: 0
      },
      // 最低价格
      minPrice: {
        type: Number,
        default: 0
      },
      // 点击一次购物车会增加一次shop-cart-sticky，进而每一次调用shop-cart中的showList
      fold: {
        type: Boolean,
        default: true
      },
      sticky: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        balls: createBalls(),
        listFold: this.fold,
        deskId: window.sessionStorage.getItem("deskId"),
        sellerId: window.sessionStorage.getItem("sellerId")
      }
    },
    computed: {
      // 总价格
      totalPrice() {
        let total = 0
        if (this.selectFoods) {
          this.selectFoods.forEach((food) => {
            total += food.price * food.count
          })
        }
        return total
      },
      // 总数量
      totalCount() {
        let count = 0
        if (this.selectFoods) {
          this.selectFoods.forEach((food) => {
            count += food.count
          })
        }
        return count
      },
      payDesc() {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`
        }
        // else if (this.totalPrice < this.minPrice) {
        //   return `还差￥${this.minPrice - this.totalPrice}元起送`
        // }
        else {
          return `去结算`
        }
      },
      // 结算样式
      payClass() {
        // 只有小于等于0时是enough,所以加上!this.totalCount
        // if (!this.totalCount || this.totalPrice < this.minPrice) {
        //   return 'not-enough'
        // }
        if (!this.totalCount) {
          return 'not-enough'
        } else {
          return 'enough'
        }
      }
    },
    created() {
      // dropBalls为什么不放在data中，因为不需要响应式，只需要临时保存一下
      this.dropBalls = []
    },
    methods: {
      // 小球飞入
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          const ball = this.balls[i]
          if (!ball.show) {
            ball.show = true
            ball.el = el
            this.dropBalls.push(ball)
            return
          }
        }
      },
      // 小球飞入前从购物车出来
      beforeDrop(el) {
        const ball = this.dropBalls[this.dropBalls.length - 1]
        // 返回元素的大小及其相对于视口的位置
        const rect = ball.el.getBoundingClientRect()
        const x = rect.left - 32
        const y = -(window.innerHeight - rect.top - 22)
        // 贝塞尔曲线
        el.style.display = ''
        // el.style.transform经常丢style
        el.style.transform = el.style.webkitTransform = `translate3d(0,${y}px,0)`
        const inner = el.getElementsByClassName(innerClsHook)[0]
        inner.style.transform = inner.style.webkitTransform = `translate3d(${x}px,0,0)`
      },
      // 飞入时，横+竖构成抛物线
      dropping(el, done) {
        // 手动取到offsetHeight,触发浏览器重绘
        this._reflow = document.body.offsetHeight
        el.style.transform = el.style.webkitTransform = `translate3d(0,0,0)`
        const inner = el.getElementsByClassName(innerClsHook)[0]
        inner.style.transform = inner.style.webkitTransform = `translate3d(0,0,0)`
        // vue为了知道过度的完成，必须设置相应的事件监听器。它可以是trantitioned或animationend
        el.addEventListener('transitionend', done)
      },
      // 飞入后又归入购物车中
      aferDrop(el) {
        const ball = this.dropBalls.shift()
        if (ball) {
          ball.show = false
          el.style.display = 'none'
        }
      },
      // 购物车展开
      showList() {
        if (this.listFold) {
          if (!this.totalCount) {
            return
          }
          this.listFold = false
          this.showShopCartList()
          this.showShopCartSticky()
        } else {
          this.listFold = true
          this.hideShopCartList()
        }
      },
      // 点击确定支付post请求
      // 购物车加入的food每个数量
      getfoodCount() {
        let list = [];
        let json = {};
        if (this.selectFoods) {
          this.selectFoods.forEach((food) => {
            json = {
              "goodId": food.foodId,
              "count": food.count
            }
            list.push(json)
          })
        }
        return list;
      },
      post() {
        // var that = this
        axios.post('http://localhost:9000/api/order',{
          deskId: this.deskId,
          sellerId: this.sellerId,
          foodDTOList: this.getfoodCount()
        },{
          responseData: "json"
        }).then(function (res) {
          // console.log(res)
        }).catch(function (error) {
          // console.log(error)
        })

      },
      // 去支付
      pay(e) {
        // if (this.totalPrice < this.minPrice) {
        //   return
        // }
        // 如果设为this.dialogComp || this.$createDialog，则每次支付的都是一样的价钱
        if (this.totalPrice === 0) {
          return
        } else if (this.totalPrice >= 28) {
          this.dialogComp = this.$createDialog({
            type: 'confirm',
            title: '支付',
            content: `您共需要支付${this.totalPrice - 5}元`,
            confirmBtn: {
              text: '确定',
              active: true,
              disabled: false,
              href: 'javascript:;'
            },
            cancelBtn: {
              text: '取消',
              active: false,
              disabled: false,
              href: 'javascript:;'
            },
            onConfirm: () => {
              this.post()
              // 清空购物车
              this.selectFoods.forEach((food) => {
                food.count = 0
              })
            }
          }).show()
        } else {
          this.dialogComp = this.$createDialog({
            type: 'confirm',
            title: '支付',
            content: `您共需要支付${this.totalPrice}元`,
            confirmBtn: {
              text: '确定',
              active: true,
              disabled: false,
              href: 'javascript:;'
            },
            cancelBtn: {
              text: '取消',
              active: false,
              disabled: false,
              href: 'javascript:;'
            },
            onConfirm: () => {
              this.post()
              // 清空购物车
              this.selectFoods.forEach((food) => {
                food.count = 0
              })
            }
          }).show()
        }
        // e.stopPropagation() // 阻止冒泡，上一个事件发生
      },
      showShopCartList() {
        this.ShopCartListComp = this.ShopCartListComp || this.$createShopCartList({
          $props: {
            // 一定要写成字符串形式，保证是响应式的
            selectFoods: 'selectFoods'
          },
          // 当点击空白处时也能触发listFold
          $events: {
            hide: () => {
              this.listFold = true
            },
            leave: () => {
              this.hideShopCartSticky()
            },
            add: (el) => {
              this.ShopCartStickyComp.drop(el)
            }
          }
        })
        this.ShopCartListComp.show()
      },
      showShopCartSticky() {
        this.ShopCartStickyComp = this.ShopCartStickyComp || this.$createShopCartSticky({
          $props: {
            selectFoods: 'selectFoods',
            deliveryPrice: 'deliveryPrice',
            minPrice: 'minPrice',
            fold: 'listFold',
            list: this.ShopCartListComp
          }
        })
        this.ShopCartStickyComp.show()
      },
      hideShopCartList() {
        // 判断什么时候用parent还是用ShopCartListComp,用sticky判断
        const comp = this.sticky ? this.$parent.list : this.ShopCartListComp
        comp.hide && comp.hide()
      },
      hideShopCartSticky() {
        this.ShopCartStickyComp.hide()
      }
    },
    watch: {
      fold(newVal) {
        this.listFold = newVal
      },
      totalCount(newVal) {
        if (!this.listFold && !newVal) {
          this.hideShopCartList()
        }
      }
    },
    components: {
      Bubble
    }
  }
</script>

<style lang="stylus" scoped>
  .shopcart
    height: 100%
    background-color: #000
    .content
      display: flex
      background-color: #141d27
      font-size: 0
      .content-left
        flex: 1
        margin-left: 8px
        height: 48px
        .logo-wrapper
          margin: 0 12px
          position: relative
          top: -10px
          display: inline-block
          vertical-align: top
          padding: 6px
          width: 58px
          height: 58px
          box-sizing: border-box
          border-radius: 50%
          background-color: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background-color: #2b343c
            &.highlight
              background-color: rgb(0,160,220)
            .icon-shopping_cart
              font-size: 24px
              color: rgba(255,255,255,0.4)
              line-height: 44px
              &.highlight
                color: #ffffff
          .num
            position: absolute
            top: 0
            right: 0
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255,255,255,0.1)
          padding-right: 12px
          font-size: 16px
          color: rgba(255,255,255,0.4)
          font-weight: 700
          line-height: 24px
          &.highlight
            color: #ffffff
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          font-size: 10px
          font-weight: 700
          color: rgba(255,255,255,0.4)
          line-height: 24px
      .content-right
        flex: 0 0 105px
        width: 105px
        height: 48px
        text-align: center
        background-color: rgba(0,0,0,0.2)
        .pay
          font-size: 12px
          font-weight: 700
          color: rgba(255,255,255,0.4)
          line-height: 48px
          height: 48px
          &.not-enough
            background-color: #2b333b
          &.enough
            background-color: #00b43c
            color: #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        transition: all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: $color-blue
          transition: all 0.4s linear
</style>
