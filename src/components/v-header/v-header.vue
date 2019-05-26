<template>
    <div class="header" @click="showDetail()">
      <div class="header-title">
        <div class="header-left">
          <img :src="seller.avatar" alt="">
        </div>
        <div class="header-right">
          <div class="right-title">
            <span class="brand"></span>
            <span class="name">{{seller.name}}</span>
          </div>
          <div class="right-content">
            <span class="description">{{seller.description}}/{{seller.deliveryTime}}分钟送达</span>
          </div>
          <!--v-if="seller.supports"因为seller.supports调用对象是undefined,嵌套比较深时用v-if-->
          <div v-if="seller.supports" class="right-footer">
            <support-ico :size=1 :type="seller.supports[0].type"></support-ico>
            <span class="supports">{{seller.supports[0].description}}</span>
          </div>
        </div>
        <div class="desk-number">
          {{deskId}}号桌
        </div>
        <div v-if="seller.supports" class="support-count">
          <span class="count">{{seller.supports.length}}个</span>
          <i class="icon-keyboard_arrow_right"></i>
        </div>
      </div>
      <div class="header-content">
        <span class="bulletin-img"></span>
        <span class="bulletin-text">{{seller.bulletin}}</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
      <div class="background">
        <img :src="seller.avatar" alt="">
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import SupportIco from '../support-ico/support-ico'

  export default {
    name: 'v-header',
    props: {
      seller: {
        type: Object,
        // 要是不初始化为空就会出错："TypeError:Cannont read property 'avatar' of undefined"
        default() {
          return {}
        }
      },
    },
    data() {
      return {
        deskId: window.sessionStorage.getItem("deskId")
      }
    },
    methods: {
      showDetail: function () {
        // 做一下缓存,如果不加this.HeaderDetailComp ||，则每次点开HeaderDetail都会在自加一次，而不是只有一个HeaderDetail
        this.HeaderDetailComp = this.HeaderDetailComp || this.$createHeaderDetail({
            $props: {
              seller: 'seller'
            }
        })
        this.HeaderDetailComp.show()
      }
    },
    components: {
      SupportIco,
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/mixin"
  @import "../../common/stylus/variable.styl"

  .header
    position: relative
    overflow: hidden
    color: $color-white
    background-color: $color-background-ss
    .header-title
      position: relative
      display: flex
      align-items: center
      padding: 24px 12px 18px 24px
      .header-left
        flex: 0 0 64px
        width: 64px
        margin-right: 16px
        img
          width: 64px
          height: 64px
          border-radius: 2px
      .header-right
        flex: 1
        .right-title
          display: flex
          align-items: center
          margin-bottom: 8px
          .brand
            width: 30px
            height: 18px
            bg-image('brand')
            background-size: 30px 18px
            background-repeat: no-repeat
          .name
            margin-left: 6px
            font-weight: bold
            font-size: 16px
            color: rgb(255,255,255)
            line-height: 18px
        .right-content
          margin-bottom: 10px
          .description
            font-size: $fontsize-small
            font-weight: 200
            color: rgb(255,255,255)
            line-height: 12px
        .right-footer
          display: flex
          align-items: center
          .support-ico
            margin-right: 4px
          .supports
            font-size: 10px
            color: rgb(255,255,255)
            font-weight: 200
            line-height: 12px
      .desk-number
        position: absolute
        display: flex
        right: 30px
        bottom: 60px
        font-size: 19px
      .support-count
        position: absolute
        display: flex
        right: 12px
        bottom: 14px
        align-items: center
        padding: 0 8px
        height: 24px
        line-height: 24px
        text-align: center
        border-radius: 14px
        background: rgba(0,0,0,0.2)
        .count
          font-size: 10px
        .icon-keyboard_arrow_right
          margin-left: 2px
    .header-content
      display: flex
      align-items: center
      padding: 0 12px
      height: 28px
      background: $color-background-sss
      line-height: 28px
      .bulletin-img
        width: 22px
        height: 12px
        bg-image('bulletin')
        margin-right: 4px
        background-size: 22px 12px
        background-repeat: no-repeat
      .bulletin-text
        flex: 1
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
        font-size: 10px
        color: rgb(255,255,255)
        font-weight: 200
      .icon-keyboard_arrow_right
        flex: 0 0 10px
        width: 10px
        font-size: 10px
    .background
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: -1
      filter: blur(10px)
</style>
