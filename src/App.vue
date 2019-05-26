<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab-wrapper">
      <tab :tabs="tabs"></tab>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import VHeader from './components/v-header/v-header'
  import Seller from './components/seller/seller'
  import Ratings from './components/ratings/ratings'
  import Goods from './components/goods/goods'
  import { getSeller } from './api'
  import Tab from './components/tab/tab'
  import qs from 'query-string'

  export default {
    name: 'app',
    data() {
      return {
        seller: {
          // 得到不同用户的id
          id: qs.parse(location.search).id
        }
      }
    },
    computed: {
      tabs() {
        return [
          {
            label: '商品',
            component: Goods,
            data: {
              seller: this.seller
            }
          },
          {
            label: '评价',
            component: Ratings,
            data: {
              seller: this.seller
            }
          },
          {
            label: '商家',
            component: Seller,
            data: {
              seller: this.seller
            }
          }
        ]
      }
    },
    created() {
      this._getSeller();
    },
    methods: {
      _getSeller() {
        // 用function方法时就得注意this,that,用this识别不出
        // var that=this
        // getSeller().then(function (seller) {
        //   that.seller = seller
        // })
        getSeller({
          id: this.seller.id
        }).then((seller) => {
          this.seller = seller
        })
      },
      _getUrlParams(){

      },

    },
    components: {
      VHeader,
      Tab
    }
  }
</script>
<style lang="stylus" scoped>
  #app
    .tab-wrapper
      position: fixed
      top: 136px
      left: 0
      right: 0
      bottom: 0
</style>
