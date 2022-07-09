//专门处理权限路由模块
import {constantRoutes, aysncRouter} from '@/router'
const state = {
    //一开始 肯定拥有静态路由的权限
    routes : constantRoutes,    //表示当前用户所拥有的所有路由的数组
}

const mutations = {
    //payload就是要传入的参数也就是我们登录后要添加的新路由
    setRoutes (state, newRoutes) {
        //每次都从静态路由基础上拿，防止动态路由混乱
        state.routes = [...constantRoutes, ...newRoutes]  //在静态路由基础上，增加每个用户自己权限设定的路由
    }
}

const actions = {
    //写一个筛选路由的函数
    //menus是用户的动态路由名称[]
    filterRouter(context, menus) {
        //这里的routes就是用来接收用户的所有动态路由
        let routes = []
        console.log(menus)
        menus.forEach(key=> {
            routes.push(...aysncRouter.filter(item => item.name === key))
        })
        console.log(routes)
        context.commit('setRoutes', routes)
        //这一步是为了给在路由守卫那里添加动态路由，返回的用户的路由
        return routes  
    }
}
    

export default {
    namespaced: true,
    state,
    mutations,
    actions
}