const path = require('path')
// const appData = require('./data.json')
// const seller = appData.seller
// const goods = appData.goods
// const ratings = appData.ratings

function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        'import': [
          './src/theme'
        ]
      }
    }
  },
  pluginOptions: {
    'cube-ui': {
      postCompile: true,
      theme: true
    }
  },
  // 与后台连接数据
  // devServer: {
  //   before(app) {
  //     app.get('/api/seller', function (req, res) {
  //       // 添加id
  //       const id = req.query.id
  //       res.json({
  //         errno: 0,
  //         data: Object.assign({}, seller, { id })
  //       })
  //     })
  //     app.get('/api/goods', function (req, res) {
  //       res.json({
  //         errno: 0,
  //         data: goods
  //       })
  //     })
  //     app.get('/api/ratings', function (req, res) {
  //       res.json({
  //         errno: 0,
  //         data: ratings
  //       })
  //     })
  //   }
  // },
  // 通过resolve函数配置的common的路径
  chainWebpack(config) {
    config.resolve.alias
      .set('components', resolve('src/components'))
      .set('common', resolve('src/common'))
      .set('api', resolve('src/api'))
  }
}
