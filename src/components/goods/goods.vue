<template>
  <div class="goods">
    <div class="scroll-nav-wrapper">
      <cube-scroll-nav
        :side="true"
        :data="goods"
        :options="scrollOptions"
        v-if="goods.length"
      >
        <template v-slot:bar="props">
          <cube-scroll-nav-bar
            :labels="props.labels"
            :txts="barTxts"
            :current="props.current"
            direction="vertical"
          >
            <!--所有的插槽相当于一个函数，作用域插槽props相当于参数，所以同时用props没有冲突-->
            <!--v-slot:default="props",写成v-slot:bar="props"会显示每个数据size=-1,name=热销榜,count=0-->
            <template v-slot:default="props">
              <div class="text">
                <support-ico v-if="props.txt.type > 0" :size=3 :type="props.txt.type"></support-ico>
                <span>{{props.txt.name}}</span>
                <div class="num" v-if="props.txt.count">
                  <bubble :num="props.txt.count"></bubble>
                </div>
              </div>
            </template>
          </cube-scroll-nav-bar>
        </template>
        <cube-scroll-nav-panel
          v-for="good in goods"
          :key="good.name"
          :label="good.name"
          :title="good.name"
        >
          <ul>
            <li
              @click="showFood(food)"
              v-for="food in good.foods"
              :key="food.name"
              class="food-item"
            >
              <div class="icon">
                <img :src="food.icon" style="width: 57px;height: 57px" alt="">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="description">{{food.description}}</p>
                <div class="sellCount">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span class="rating">好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="newPrice">￥{{food.price}}</span>
                  <span v-show="food.oldPrice" class="oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cart-contronl-wrapper">
                  <cart-control @add="onAdd" :food="food"></cart-control>
                </div>
              </div>
            </li>
          </ul>
        </cube-scroll-nav-panel>
      </cube-scroll-nav>
    </div>
    <div class="shop-cart-wrapper">
      <shop-cart ref="ShopCart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shop-cart>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getGoods } from '../../api'
  import SupportIco from '../support-ico/support-ico'
  import ShopCart from '../shop-cart/shop-cart'
  import CartControl from '../cart-control/cart-control'
  import Bubble from '../bubble/bubble'

  export default {
    name: 'goods',
    props: {
      data: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        goods: [],
        scrollOptions: {
          // 出现两次点击事件是看用click还是stopPrevent,这里不用阻止是因为这阻止了，接下来的滑动也不能用
          click: false,
          directionLockThreshold: 0
        },
        selectedFood: {}
      }
    },
    computed: {
      seller() {
        return this.data.seller
      },
      selectFoods() {
        let ret = []
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              ret.push(food)
            }
          })
        })
        return ret
      },
      // 侧边栏插槽自定义内容
      barTxts() {
        let ret = []
        this.goods.forEach((good) => {
          const { type, name, foods } = good
          // 遍历为了得到food数量
          let count = 0
          foods.forEach((food) => {
            // 当是undefined时是不进行自加的,所以就为0
            count += food.count || 0
          })
          ret.push({
            type,
            name,
            count
          })
        })
        return ret
      }
    },
    methods: {
      // 滑动到页面加载后台
      fetch() {
        // 滑动回来添加的food仍然在，如果没有fetch过则进行fetch,fetch过则不再进行，
        // 当开始未定义undefined，也为false,!false需要fetch
        if (!this.fetched) {
          this.fetched = true
          getGoods({
            id: this.seller.id
          }).then((goods) => {
            this.goods = goods
          })
        }
      },
      onAdd(el) {
        this.$nextTick(() => {
          this.$refs.ShopCart.drop(el)
        })
      },
      // 每个food点开显示food详情
      showFood(food) {
        this.selectedFood = food
        this.FoodComp = this.FoodComp || this.$createFood({
          $props: {
            food: 'selectedFood'
          },
          $events: {
            leave: () => {
              this.hideShopCartList()
            },
            add: (el) => {
              this.ShopCartStickyComp.drop(el)
            }
          }
        })
        this.FoodComp.show()
        this.showShopCartSticky()
      },
      // 展开food详情时底下购物车遮挡，需要添加shop-cart-sticky
      showShopCartSticky() {
        this.ShopCartStickyComp = this.ShopCartStickyComp || this.$createShopCartSticky({
          $props: {
            selectFoods: 'selectFoods',
            deliveryPrice: this.seller.deliveryPrice,
            minPrice: this.seller.minPrice,
            fold: true,
            // 因为shop-cart-sticky中有list，所以得添加上
            list: {}
          }
        })
        this.ShopCartStickyComp.show()
      },
      hideShopCartList() {
        this.ShopCartStickyComp.hide()
      }
    },
    components: {
      SupportIco,
      ShopCart,
      CartControl,
      Bubble
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/mixin.styl"
  @import "../../common/stylus/variable.styl"
  .goods
    position: relative
    text-align: left
    height: 100%
    .scroll-nav-wrapper
      position: absolute
      width: 100%
      top: 0
      left: 0
      bottom: 48px
    >>> .cube-scroll-nav-bar
      width: 80px
      white-space: normal
      overflow: hidden
    >>> .cube-scroll-nav-bar-item
      padding: 0 10px
      display: flex
      height: 56px
      align-items: center
      text-align: center
      background-color: #f3f5f7
      font-size: 12px
      color: #333
      line-height: 14px
      .text
        flex: 1
        position: relative
        .support-ico
          display: inline-block
          margin-right: 4px
          vertical-align: top
        .num
          position: absolute
          right: -8px
          top: -10px
    >>> .cube-scroll-nav-bar-item_active
      background-color: #ffffff
      color: rgb(240,20,20)
    >>> .cube-scroll-nav-panel-title
      flex: 1
      height: 26px
      border-left: 3px solid #d9dde1
      background-color: #f3f5f7
      font-size: 12px
      line-height: 26px
      color: rgb(147,153,159)
      padding-left: 14px
    .food-item
      margin: 18px
      display: flex
      padding-bottom: 18px
      position: relative
      .icon
        flex: 0 0 57px
        width: 57px
        height: 57px
        margin-right: 10px
      .content
        flex: 1
        .name
          padding-top: 2px
          font-size: 14px
          font-weight: 700
          height: 14px
          line-height: 14px
          color: rgb(7,17,27)
        .description
          padding-top: 8px
          font-size: 10px
          line-height: 10px
          color: rgb(147,153,159)
        .sellCount
          padding-top: 8px
          font-size: 10px
          line-height: 10px
          color: rgb(147,153,159)
          .count
            padding-right: 12px
        .price
          font-weight: 700
          line-height: 24px
          padding-top: 8px
          .newPrice
            font-size: 14px
            color: rgb(240,20,20)
            padding-right: 8px
          .oldPrice
            font-size: 10px
            color: rgb(147,153,159)
            text-decoration: line-through
        .cart-contronl-wrapper
          /*上一级food-item：position: relative*/
          position: absolute
          right: 0px
          bottom: 12px
    .shop-cart-wrapper
      position: absolute
      left: 0px
      bottom: 0px
      width: 100%
      height: 48px
      z-index: 50
</style>
