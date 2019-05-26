<template>
  <div class="bubble">
    {{num}}
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'bubble',
    props: {
      num: {
        type: Number
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable.styl"
  .bubble
    display: inline-block
    padding: 0 5px
    height: 16px
    line-height: 16px
    text-align: center
    border-radius: 16px
    font-family: Helvetica
    font-weight: 700
    font-size: 9px
    color: rgb(255,255,255)
    background: linear-gradient(to right ,$color-orange,$color-red)
</style>
