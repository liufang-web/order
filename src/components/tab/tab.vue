<template>
  <div class="tab">
    <cube-tab-bar
      :showSlider="true"
      :useTransition="false"
      v-model="selectedLabel"
      :data="tabs"
      ref="tabBar"
      class="border-bottom-1px">
    </cube-tab-bar>
    <div class="slide-wrapper">
      <cube-slide
        :loop="false"
        :auto-play="false"
        :show-dots="false"
        :initial-index="index"
        ref="slide"
        @change="onChange"
        @scroll="onScroll"
        :options="slideOptions"
      >
        <!--代替了<cube-slide-item><goods></goods></cube-slide-item>,动态获得内容,而不是固定住-->
        <cube-slide-item v-for="(tab,index) in tabs" :key="index">
          <component :is="tab.component" :data="tab.data" ref="component"></component>
        </cube-slide-item>
      </cube-slide>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'tab',
    props: {
      tabs: {
        type: Array,
        default() {
          return []
        }
      },
      initialIndex: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        index: this.initialIndex,
        slideOptions: {
          listenScroll: true,
          probeType: 3,
          // 设置为0，否则当页面能竖着滚动时，横竖滚动会变成斜着
          directionLockThreshold: 0
        }
      }
    },
    computed: {
      // 改变cube-tab-bar，也就是点击事件
      selectedLabel: {
        get() {
          return this.tabs[this.index].label
        },
        set(newVal) {
          this.index = this.tabs.findIndex((value) => {
            return value.label === newVal
          })
        }
      }
    },
    mounted () {
      this.onChange(this.index)
    },
    methods: {
      // 改变滑动事件，从而使点击也跟随改变
      onChange(current) {
        this.index = current
        const component = this.$refs.component[current]
        component.fetch && component.fetch()
      },
      // 使滑动过程中，内容滑动，tab横线也跟随滑动，用相对比例
      onScroll(pos) {
        const tabBarWidth = this.$refs.tabBar.$el.clientWidth
        // 每个滑动过程中横线都会随着滚动
        const slideWidth = this.$refs.slide.slide.scrollerWidth
        const transform = (-pos.x / slideWidth) * tabBarWidth
        // const transform = tabBarWidth / this.tabs.length没有中间过程，相当于onScroll没用
        this.$refs.tabBar.setSliderTransform(transform)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable.styl"

  .tab
    >>> .cube-tab
      padding: 10px 0
    display: flex
    flex-direction: column
    height: 100%
    .slide-wrapper
      flex: 1
      overflow: hidden
</style>
