<template>
  <cube-scroll class="ratings" :data="computedRatings" :options="scrollOptions">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <spilt></spilt>
      <rating-select
        :ratings="ratings"
        :selectType="selectType"
        :onlyContent="onlyContent"
        @select="onSelect"
        @toggle="onToggle"
        v-if="ratings.length"
      ></rating-select>
      <div class="rating-wrapper">
        <ul>
          <li v-for="(rating,index) in computedRatings" :key="index" class="rating-item border-bottom-1px">
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28" alt="">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
              </div>
              <div class="text">
                {{rating.text}}
              </div>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span class="item" v-for="(item,index) in rating.recommend" :key="index">
                  {{item}}
                </span>
              </div>
              <div class="time">
                {{format(rating.rateTime)}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </cube-scroll>
</template>

<script type="text/ecmascript-6">
  import { getRatings } from '../../api'
  import Star from '../star/star'
  import Spilt from '../spilt/split'
  import RatingSelect from '../rating-select/rating-select'
  import moment from 'moment'
  import RatingMixin from '../../common/mixins/rating'

  export default {
    name: 'ratings',
    mixins: [RatingMixin],
    props: {
      data: {
        type: Object
      }
    },
    data() {
      return {
        ratings: [],
        scrollOptions: {
          click: false,
          directionLockThreshold: 0
        }
      }
    },
    computed: {
      seller() {
        return this.data.seller || {}
      }
    },
    methods: {
      // 滑动到页面加载后台
      fetch() {
        // 滑动回来添加的food仍然在，如果没有fetch过则进行fetch,fetch过则不再进行，
        // 当开始未定义undefined，也为false,!false需要fetch
        if (!this.fetched) {
          this.fetched = true
          getRatings({
            id: this.seller.id
          }).then((ratings) => {
            this.ratings = ratings
          })
        }
      },
      format(time) {
        return moment(time).format('YYYY-MM-DD hh:mm')
      }
    },
    components: {
      Star,
      Spilt,
      RatingSelect
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"

  .ratings
    position: relative
    text-align: left
    white-space: normal
    height: 100%
    .overview
      display: flex
      padding: 18px 0
      .overview-left
        flex: 0 0 137px
        padding: 6px 0
        width: 137px
        border-right: 1px solid $color-col-line
        text-align: center
        @media only screen and (max-width: 320px)
          flex: 0 0 120px
          width: 120px
        .score
          margin-bottom: 6px
          font-size: 24px
          line-height: 28px
          color: rgb(255,153,0)
        .title
          margin-bottom: 8px
          font-size: 12px
          line-height: 12px
          color: rgb(7,17,27)
        .rank
          font-size: 10px
          line-height: 10px
          color: rgb(7,17,27)
      .overview-right
        flex: 1
        padding: 6px 0 6px 24px
        @media only screen and (max-width: 320px)
          padding-left: 6px
        .score-wrapper
          display: flex
          align-items: center
          margin-bottom: 8px
          .title
            margin-right: 12px
            font-size: 12px
            line-height: 18px
            color: rgb(7,17,27)
          .score
            margin-left: 12px
            font-size: 12px
            line-height: 18px
            color: rgb(255,153,0)
        .delivery-wrapper
          display: flex
          align-items: center
          .title
            margin-right: 12px
            font-size: 12px
            line-height: 18px
            color: rgb(7,17,27)
          .delivery
            font-size: 12px
            line-height: 18px
            color: rgb(147,153,159)
    .rating-wrapper
      padding: 0 18px
      .rating-item
        display: flex
        padding: 18px 0
        &:last-child
          border-none()
        .avatar
          flex: 0 0 28px
          width: 28px
          margin-right: 12px
          img
            height: auto
            border-radius: 50%
        .content
          flex: 1
          position: relative
          .name
            margin-bottom: 4px
            font-size: 10px
            line-height: 12px
            color: rgb(7,17,27)
          .star-wrapper
            margin-bottom: 6px
            display: flex
            align-items: center
            .delivery
              margin-left: 6px
              font-size: 10px
              line-height: 12px
              color: rgb(147,153,159)
              font-weight: 200
          .text
            margin-bottom: 8px
            font-size: 12px
            line-height: 18px
            color: rgb(7,17,27)
          .recommend
            display: flex
            align-items: center
            flex-wrap: wrap
            line-height: 16px
            .icon-thumb_up
              margin-right: 8px
              font-size: 12px
              color: rgb(0,160,220)
            .item
              margin-right: 8px
              font-size: 9px
              color: rgb(147,153,159)
              padding: 0 6px
              border: 1px solid rgba(7,17,27,0.1)
              border-radius: 1px
              background-color: rgb(255,255,255)
          .time
            position: absolute
            top: 0
            right: 0
            font-size: 10px
            line-height: 12px
            color: rgb(147,153,159)
            font-weight: 200
</style>
