//权限拦截在路由跳转 导航守卫
import router from '@/router'
import store from '@/store'
//引入进度条插件和样式
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

//定义一个白名单
const whiteList = ['/login', '/404']
//导航的前置守卫
router.beforeEach(async (to, from, next) => {
    Nprogress.start()   //开启进度条
    if (store.getters.token) {
        //如果有token
        if (to.path === '/login') {
            //如果去的是登录页
            next('/')
        } else {
            //只有放过的时候才去获取用户资料
            //如果当前vuex中有用户资料的id则表示有资料了，就可以不需要获取
            if (!store.getters.userId) {
                //没有才要去获取
                // actions中函数 默认是Promise对象 调用这个对象 想要获取返回的值话 必须 加 await或者是then
                // actions是做异步操作的,所以这里的没有直接调用接口但依旧要使用aysnc和await的原因
                const {roles} = await store.dispatch('user/UserInfo')
                //如果说后续要根据用户资料获取数据的话 这里必须改成同步的
                const routes = await store.dispatch('permission/filterRouter', roles.menus)
                router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])
                //使用router.addRoutes必须使用next(地址)，不能使用next()
                //因为next()就是放行继续沿着这条路走，next(地址)是直接跳到这个地址
                //虽然给路由表中加了动态路由，next(）放行的这条路等于老路还没有把加进去的路由铺好。
                //所以，使用next(地址)等于重新进一次这条路。当重新走的时候，这条路已经重新铺好了。
                next(to.path)
            } else {
                next()
            }
        }
    } else {
        //如果没有token
        if (whiteList.indexOf(to.path) > -1) {
            //如果在白名单内
            next()
        } else {
            //如果不在白名单内
            next('/login')
        }
    }
    Nprogress.done()   //手动强制关闭一次，为了解决手动切换地址时 进度条不关闭的问题
})

//导航的后置守卫
router.afterEach(() => {
    Nprogress.done()   //关闭进度条
})

//我们在这里不需要导出，因为只要让代码执行