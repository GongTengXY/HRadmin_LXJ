import request from '@/utils/request'

export const login = data => request({
  method : 'post',
  url : '/sys/login',
  data,
})

export const getUserInfo = () => request({
  method : 'post',
  url : '/sys/profile',
})

//获取用户基本信息可用来获取头像
export const getUserPhoto = (params) => request({
  method : 'get',
  url : `/sys/user/${params}`
})
