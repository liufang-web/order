<template>
  <div class="shop-cart-sticky" v-show="visible">
    <shop-cart
      ref="shopCart"
      :select-foods="selectFoods"
      :delivery-price="deliveryPrice"
      :min-price="minPrice"
      :fold="fold"
      :sticky="true"
    ></shop-cart>
  </div>
</template>

<script type="text/ecmascript-6">
  import ShopCart from '../shop-cart/shop-cart'
  export default {
    name: 'shop-cart-sticky',
    data() {
      return {
        visible: false
      }
    },
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
      fold: {
        type: Boolean,
        default: true
      },
      list: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    methods: {
      show() {
        this.visible = true
      },
      hide() {
        this.visible = false
      },
      drop(el) {
        this.$refs.shopCart.drop(el)
      }
    },
    components: {
      ShopCart
    }
  }
</script>

<style lang="stylus" scoped>
  .shop-cart-sticky
    position: absolute
    left: 0
    bottom: 0
    z-index: 999
    width: 100%
    height: 48px
</style>
