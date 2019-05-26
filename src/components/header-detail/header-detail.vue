<template>
    <div class="header-detail" v-show="visible">
      <div class="detail-wrapper">
        <div class="detail-main">
          <h1 class="name">{{seller.name}}</h1>
          <div class="star-wrapper">
            <star :score="seller.score" :size=48></star>
          </div>
        </div>
        <div class="title">
          <div class="line"></div>
          <div class="text">优惠信息</div>
          <div class="line"></div>
        </div>
        <ul v-if="seller.supports" class="supports">
          <li class="support-item" v-for="(item,index) in seller.supports" :key="index">
            <support-ico :size=2 :type="seller.supports[index].type"></support-ico>
            <span class="description">{{seller.supports[index].description}}</span>
          </li>
        </ul>
        <div class="title">
          <div class="line"></div>
          <div class="text">商家公告</div>
          <div class="line"></div>
        </div>
        <div class="bulletin">
          <span>{{seller.bulletin}}</span>
        </div>
        <div class="close" @click="hide()">
          <span class="icon-close"></span>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import Star from '../star/star'
  import SupportIco from '../support-ico/support-ico'

  export default {
    name: 'header-detail',
    props: {
      seller: {
        type: Object,
        default() {
          return {}
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
      },
      hide() {
        this.visible = false
      }
    },
    components: {
      SupportIco,
      Star
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable.styl";
  @import "../../common/stylus/mixin.styl";

  .header-detail
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    display: flex
    z-index: 100
    background-color: $color-background-s
    color: $color-white
    backdrop-filter: blur(10px)
    overflow: auto
    .detail-wrapper
      display: inline-block
      width: 100%
      min-height: 100%
      .detail-main
        margin: 64px auto 28px auto
        .name
          font-size: 16px
          font-weight: 700
          line-height: 16px
          margin-bottom: 16px
          text-align: center
        .star-wrapper
          width: 100%
          height: 24px
          text-align: center
      .title
        width: 80%
        margin: 28px auto 24px auto
        display: flex
        .line
          flex: 1
          position: relative
          top: -6px
          border-bottom: 1px solid rgba(255,255,255,0.2)
        .text
          font-size: 14px
          font-weight: 700
          line-height: 14px
          padding: 0 12px
      .supports
        width: 80%
        margin: 0 auto
        .support-item
          display: flex
          align-items: center
          padding: 0 12px
          margin-bottom: 12px
          &:last-child
            margin-bottom: 0
          .support-ico
            margin-right: 6px
          .description
            font-size: 12px
            font-weight: 200
            line-height: 12px
      .bulletin
        display: flex
        align-items: center
        width: 80%
        margin: 0 auto
        padding: 0 12px
        font-size: 12px
        font-weight: 200
        line-height: 24px
      .close
        text-align: center;
        margin-top: 80px;
        .icon-close
          font-size: 32px
          color: rgba(255,255,255,0.5)
</style>
