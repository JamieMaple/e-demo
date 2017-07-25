// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import goods from './components/goods/goods'
import ratings from './components/ratings/ratings'
import seller from './components/seller/seller'

import './common/stylus/index.styl'

import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

Vue.use(VueRouter)
Vue.use(VueResource)

Vue.config.productionTip = false
/* routes */
let routes = [
      {path: '/goods', component: goods},
      {path: '/ratings', component: ratings},
      {path: '/seller', component: seller}
]
let router = new VueRouter({ routes , 'linkActiveClass': 'active'})
/* eslint-disable no-new */
/* default page*/
router.push('/goods')

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  render: h => h(App)
})
