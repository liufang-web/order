<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="decrease" v-show="food.count > 0" @click.stop="decrease">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="num" v-show="food.count > 0">{{food.count}}</div>
    <!--在事件被触发后会向add(event)函数传递vue中定义的$event实例对象,写成add(event)会显示target未定义-->
    <div class="add" @click.stop="add($event)">
      <span class="icon-add_circle"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const ENENT_ADD = 'add'
  export default {
    name: 'cart-control',
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      add(event) {
        if (!this.food.count) {
          // vue中自设置属性识别不出，所以要添加属性，响应式添加用api,this,$set
          this.$set(this.food, 'count', 1)
        } else {
          this.food.count++
        }
        // 派发事件
        this.$emit(ENENT_ADD, event.target)
      },
      decrease() {
        if (this.food.count) {
          this.food.count--
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .cartcontrol
    display: flex
    align-items: center
    .decrease
      display: inline-block
      opacity: 1
      padding: 6px
      .inner
        display: inline-block
        color: rgb(0,160,220)
        font-size: 24px
        line-height: 24px
        transition: all 0.4s linear
        transform: rotate(0)
      &.move-enter-active,&.move-leave-active
        transition: all 0.4s linear
      &.move-enter, &.move-leave-active
        opacity: 0
        transform: translate3d(24px, 0, 0)
        .inner
          transform: rotate(180deg)
    .num
      width: 12px
      font-size: 10px
      color: rgb(147,153,159)
      line-height: 24px
      text-align: center
    .add
      display: inline-block
      font-size: 24px
      color: rgb(0,160,220)
      line-height: 24px
      padding: 6px
</style>
