import {getToken, setToken, removeToken, setTimeStamp} from '@/utils/auth'
import {login, getUserInfo, getUserPhoto} from '@/api/user'
import { resetRouter } from '@/router'
//状态
const state = {
  token : getToken(),  //设置token为共享状态 出手啊vuex的时候 就先从本地拿
  userInfo : {},    //用户的个人信息
}

const mutations = {
  setUser (state, token) {
    state.token = token     //将数据设置给vuex
    //同步存储到本地存储中，数据持久化
    setToken(token)
  },
  
  removeUser (state) {
    state.token = null  //将vuex的state清零
    removeToken()   //同步到缓存
  },

  setUserInfo (state, res) {
    state.userInfo = {...res}
  },

  removeUserInfo (state) {
    state.userInfo = {}
  }
}

const actions = {
  //登录
  async loginUser (context, data) {
    //调用api接口
    const res = await login(data)
      
    context.commit('setUser', res)
    //拿到了token说明登录成功
    setTimeStamp()          //设置当前时间戳
  },
  //获取用户信息
  async UserInfo (context) {
    const res = await getUserInfo()
    //获取用户的详情
    const baseInfo = await getUserPhoto(res.userId)
    //然后将两个将两个接口获取的合并
    const baseResult = {...res, ...baseInfo}
    context.commit('setUserInfo', baseResult)   //这样一来用户的信息可以就更加完整，一次性都传入进去了
    return res //返回res是为了给后面添加动态路由传递用户的信息        
  },
  //退出登录
  logout (context) {
    //删除token
    context.commit('removeUser')
    //删除用户资料
    context.commit('removeUserInfo')
    //重置路由
    resetRouter()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}