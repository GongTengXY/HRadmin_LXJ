import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import * as directives from '@/directives'
import Component from '@/components'
import * as filters from '@/filters';
import Print from 'vue-print-nb'
import i18n from '@/lang' // 引入i18n实例

import CheckPermission from '@/mixin/checkPermission'
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */

// set ElementUI lang to EN

// 注册自定义指令
// 遍历所有的导出的指令对象 完成自定义全局注册
Object.keys(directives).forEach(key => {
  // 注册自定义指令
  Vue.directive(key, directives[key])
})

//定义全局过滤器
Object.keys(filters).forEach(key => {
  //注册全局过滤器
  Vue.filter(key,filters[key])
})

Vue.config.devtools = true;

Vue.use(Print)

// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI,{
  i18n: (key, value) => i18n.t(key, value)
})

//注册自己的插件
Vue.use(Component)

//注册全局检查权限对象
Vue.mixin(CheckPermission)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
